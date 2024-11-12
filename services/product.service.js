const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { config } = require('../config/config');
const { models } = require('../libs/sequelize');
const { createProductSchema } = require('../schemas/product.schema');

class ProductService {
  async create(data, files) {
    const { error } = createProductSchema.validate(data);
    if (error) {
      throw boom.badRequest(error.details[0].message);
    }
    const { categoryId, name, status, description, price } = data;

    if (!files.anverso || !files.reverso) {
      throw boom.badRequest('Las imágenes anverso y reverso son requeridas');
    }

    const image1Path = files.anverso[0].buffer;
    const image2Path = files.reverso[0].buffer;

    const optimizedImage1 = await sharp(image1Path)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    const optimizedImage2 = await sharp(image2Path)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    const image1FullPath = path.join(
      __dirname,
      '..',
      'uploads',
      `${path.parse(files.anverso[0].originalname).name}.webp`,
    );

    const image2FullPath = path.join(
      __dirname,
      '..',
      'uploads',
      `${path.parse(files.reverso[0].originalname).name}.webp`,
    );

    fs.writeFileSync(image1FullPath, optimizedImage1);
    fs.writeFileSync(image2FullPath, optimizedImage2);

    const productData = {
      categoryId,
      name,
      status,
      description,
      price,
      imagePath1: `${config.imagesPath}${path.parse(files.anverso[0].originalname).name}.webp`,
      imagePath2: `${config.imagesPath}${path.parse(files.reverso[0].originalname).name}.webp`,
    };

    try {
      const product = await models.Product.create(productData);
      return product;
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const messages = error.errors.map((e) => e.message);
        throw boom.badRequest(messages.join(', '));
      }
      throw error;
    }
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

  async findAll() {
    const products = await models.Product.findAll();
    return products;
  }

  async search(query) {
    const products = await models.Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
        deleted: false,
      },
    });
    return products;
  }

  async findOne(id) {
    const products = await models.Product.findByPk(id, {});
    if (!products) {
      throw boom.notFound('Product not found');
    }
    return products;
  }

  async update(id, changes, files) {
    const product = await this.findOne(id);

    if (files && files.anverso) {
      if (product.imagePath1) {
        const oldImageAnversoPath = path.join(
          __dirname,
          '..',
          'uploads',
          path.basename(product.imagePath1),
        );
        if (fs.existsSync(oldImageAnversoPath)) {
          fs.unlinkSync(oldImageAnversoPath);
        }
      }

      const image1Path = files.anverso[0].buffer;

      const optimizedImage1 = await sharp(image1Path)
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer();

      const image1FullPath = path.join(
        __dirname,
        '..',
        'uploads',
        `${path.parse(files.anverso[0].originalname).name}.webp`,
      );

      fs.writeFileSync(image1FullPath, optimizedImage1);

      changes.imagePath1 = `${config.imagesPath}${path.parse(files.anverso[0].originalname).name}.webp`;
    }

    if (files && files.reverso) {
      if (product.imagePath2) {
        const oldImageReversoPath = path.join(
          __dirname,
          '..',
          'uploads',
          path.basename(product.imagePath2),
        );
        if (fs.existsSync(oldImageReversoPath)) {
          fs.unlinkSync(oldImageReversoPath);
        }
      }

      const image2Path = files.reverso[0].buffer;

      const optimizedImage2 = await sharp(image2Path)
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer();

      const image2FullPath = path.join(
        __dirname,
        '..',
        'uploads',
        `${path.parse(files.reverso[0].originalname).name}.webp`,
      );

      fs.writeFileSync(image2FullPath, optimizedImage2);

      changes.imagePath2 = `${config.imagesPath}${path.parse(files.reverso[0].originalname).name}.webp`;
    }

    await product.update(changes);
    return product;
  }

  async delete(id) {
    const product = await this.findOne(id);
    if (!product) {
      throw boom.notFound('Product not found');
    }
    await product.update({ deleted: true, deletedAt: new Date() });
    return { id };
  }
}

module.exports = ProductService;
