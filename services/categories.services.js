const AWS = require('aws-sdk');
const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { config } = require('../config/config');
const { models } = require('../libs/sequelize');
const { createCategorySchema } = require('../schemas/category.schema');

// Configuración de AWS S3
const s3 = new AWS.S3();
const BUCKET_NAME = 'elasticbeanstalk-us-east-1-850995550371'; // Cambia esto a tu bucket

class CategoryService {
  // Método para optimizar imagen
  async optimizeImage(file) {
    return sharp(file.buffer)
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
      Key: `images/${path.parse(originalName).name}.webp`, // Cambia la ruta si necesitas
      Body: optimizedImage,
      ContentType: mimetype,
      ACL: 'public-read', // Para que sea accesible públicamente
    };
    const data = await s3.upload(params).promise();
    return data.Location; // URL de la imagen en S3
  }

  async create(data, file) {
    const { error } = createCategorySchema.validate(data);
    if (error) {
      throw boom.badRequest(error.details[0].message);
    }

    if (!file) {
      throw boom.badRequest('La imagen es requerida');
    }

    const optimizedImage = await this.optimizeImage(file);

    // Decide entre almacenamiento local o S3
    let imagePath;
    if (process.env.NODE_ENV === 'production') {
      imagePath = await this.uploadImageToS3(optimizedImage, file.originalname, file.mimetype);
    } else {
      imagePath = await this.saveImageLocally(optimizedImage, file.originalname);
    }

    const categoryData = { ...data, imagePath };

    try {
      const category = await models.Category.create(categoryData);
      return category;
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map((e) => e.message);
        throw boom.badRequest(messages.join(', '));
      }
      throw error;
    }
  }

  async update(id, changes, file) {
    const category = await this.findOne(id);

    if (file) {
      const optimizedImage = await this.optimizeImage(file);

      if (process.env.NODE_ENV === 'production') {
        // Si hay una imagen en S3, eliminarla antes de subir la nueva
        if (category.imagePath) {
          const key = category.imagePath.split(`${BUCKET_NAME}/`)[1];
          if (key) {
            await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
          }
        }
        changes.imagePath = await this.uploadImageToS3(optimizedImage, file.originalname, file.mimetype);
      } else {
        // Elimina la imagen local si ya existe
        if (category.imagePath) {
          const oldImagePath = path.join(
            __dirname,
            '..',
            'uploads',
            path.basename(category.imagePath),
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        changes.imagePath = await this.saveImageLocally(optimizedImage, file.originalname);
      }
    }

    await category.update(changes);
    return category;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'],
    });
    if (!category) {
      throw boom.notFound('Category not found');
    }
    return category;
  }

  async find({ page = 1, pageSize = 10, paginated = true } = {}) {
    if (!paginated) {
      const categories = await models.Category.findAll();
      return {
        totalItems: categories.length,
        totalPages: 1,
        currentPage: 1,
        data: categories,
      };
    }

    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const { count, rows } = await models.Category.findAndCountAll({
      where: { deleted: false },
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

  async delete(id) {
    const category = await this.findOne(id);
    if (!category) {
      throw boom.notFound('Category not found');
    }
    await category.update({ deleted: true, deletedAt: new Date() });
    return { id };
  }

  async search(query) {
    const categories = await models.Category.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
        deleted: false,
      },
    });
    return categories;
  }
}

module.exports = CategoryService;
