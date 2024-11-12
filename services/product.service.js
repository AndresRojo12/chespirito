const AWS = require('aws-sdk');
const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { config } = require('../config/config');
const { models } = require('../libs/sequelize');
const { createProductSchema } = require('../schemas/product.schema');

// Configuración de AWS S3
const s3 = new AWS.S3();
const BUCKET_NAME = 'elasticbeanstalk-us-east-1-850995550371'; // Cambia esto a tu bucket

class ProductService {
  // Método para optimizar imagen
  async optimizeImage(fileBuffer) {
    return sharp(fileBuffer)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();
  }

  // Almacenamiento local de imagen
  async saveImageLocally(optimizedImage, originalName) {
    const imagePath = path.join(
      __dirname,
      '..',
      'uploads',
      `${path.parse(originalName).name}.webp`,
    );
    fs.writeFileSync(imagePath, optimizedImage);
    return `${config.imagesPath}${path.parse(originalName).name}.webp`;
  }

  // Almacenamiento en S3
  async uploadImageToS3(optimizedImage, originalName, mimetype) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `products/${path.parse(originalName).name}.webp`,
      Body: optimizedImage,
      ContentType: mimetype,
      ACL: 'public-read',
    };
    const data = await s3.upload(params).promise();
    return data.Location; // URL de la imagen en S3
  }

  async create(data, files) {
    const { error } = createProductSchema.validate(data);
    if (error) {
      throw boom.badRequest(error.details[0].message);
    }

    if (!files.anverso || !files.reverso) {
      throw boom.badRequest('Las imágenes anverso y reverso son requeridas');
    }

    const optimizedImage1 = await this.optimizeImage(files.anverso[0].buffer);
    const optimizedImage2 = await this.optimizeImage(files.reverso[0].buffer);

    const image1Path = process.env.NODE_ENV === 'production'
      ? await this.uploadImageToS3(optimizedImage1, files.anverso[0].originalname, files.anverso[0].mimetype)
      : await this.saveImageLocally(optimizedImage1, files.anverso[0].originalname);

    const image2Path = process.env.NODE_ENV === 'production'
      ? await this.uploadImageToS3(optimizedImage2, files.reverso[0].originalname, files.reverso[0].mimetype)
      : await this.saveImageLocally(optimizedImage2, files.reverso[0].originalname);

    const productData = {
      ...data,
      imagePath1: image1Path,
      imagePath2: image2Path,
    };

    try {
      const product = await models.Product.create(productData);
      return product;
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map((e) => e.message);
        throw boom.badRequest(messages.join(', '));
      }
      throw error;
    }
  }

  async update(id, changes, files) {
    const product = await this.findOne(id);

    if (files && files.anverso) {
      const optimizedImage1 = await this.optimizeImage(files.anverso[0].buffer);

      if (process.env.NODE_ENV === 'production') {
        if (product.imagePath1) {
          const key = product.imagePath1.split(`${BUCKET_NAME}/`)[1];
          if (key) {
            await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
          }
        }
        changes.imagePath1 = await this.uploadImageToS3(optimizedImage1, files.anverso[0].originalname, files.anverso[0].mimetype);
      } else {
        if (product.imagePath1) {
          const oldImageAnversoPath = path.join(__dirname, '..', 'uploads', path.basename(product.imagePath1));
          if (fs.existsSync(oldImageAnversoPath)) {
            fs.unlinkSync(oldImageAnversoPath);
          }
        }
        changes.imagePath1 = await this.saveImageLocally(optimizedImage1, files.anverso[0].originalname);
      }
    }

    if (files && files.reverso) {
      const optimizedImage2 = await this.optimizeImage(files.reverso[0].buffer);

      if (process.env.NODE_ENV === 'production') {
        if (product.imagePath2) {
          const key = product.imagePath2.split(`${BUCKET_NAME}/`)[1];
          if (key) {
            await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
          }
        }
        changes.imagePath2 = await this.uploadImageToS3(optimizedImage2, files.reverso[0].originalname, files.reverso[0].mimetype);
      } else {
        if (product.imagePath2) {
          const oldImageReversoPath = path.join(__dirname, '..', 'uploads', path.basename(product.imagePath2));
          if (fs.existsSync(oldImageReversoPath)) {
            fs.unlinkSync(oldImageReversoPath);
          }
        }
        changes.imagePath2 = await this.saveImageLocally(optimizedImage2, files.reverso[0].originalname);
      }
    }

    await product.update(changes);
    return product;
  }

  async find({ page = 1, pageSize = 10 } = {}) {
    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const { count, rows } = await models.Product.findAndCountAll({
      where: {
        deleted: false,
      },
      include: ['category'],
      limit,
      offset,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page) || 1,
      data: rows,
    };
  }

  async search(query) {
    const products = await models.Product.findAll({
      where: {
        deleted: false,
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
      include: ['category'],
    });
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category'],
    });
    if (!product || product.deleted) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async delete(id) {
    const product = await this.findOne(id);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    if (product.imagePath1) {
      const key = product.imagePath1.split(`${BUCKET_NAME}/`)[1];
      if (key) {
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      }
    }
    if (product.imagePath2) {
      const key = product.imagePath2.split(`${BUCKET_NAME}/`)[1];
      if (key) {
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      }
    }

    await product.update({ deleted: true, deletedAt: new Date() });
    return { id };
  }
}

module.exports = ProductService;
