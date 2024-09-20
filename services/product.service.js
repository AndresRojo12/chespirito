const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');

class ProductService {
  async create(data, file) {
    const { categoryId, name, status, description, price } = data;
    const imagenOriginal = file.buffer;

    const imagenOptimizada = await sharp(imagenOriginal).resize(800).toBuffer();

    const imagePath = path.join(__dirname, '..', 'uploads', file.originalname);
    fs.writeFileSync(imagePath, imagenOptimizada);

    const productData = {
      categoryId,
      name,
      status,
      description,
      price,
      imagePath: `${config.imagesPath}${file.originalname}`,
    };

    const product = await models.Product.create(productData);

    return product;
  }


  async find({ page = 1, pageSize = 10 } = {}) {

    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const { count, rows } = await models.Product.findAndCountAll({
      where: {
        deleted:false
      },
      include:['category'],
      limit,
      offset
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page) || 1,
      data: rows
    }

  }

  async findAll() {
    const products = await models.Product.findAll();
    return products;
  }


  async search(query) {
    const products = await models.Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      }
    });
    return products;
  }

  async findOne(id) {
    const products = await models.Product.findByPk(id, {
    });
    if (!products) {
      throw boom.notFound('Product not found');
    }
    return products;
  }

  async update(id, changes, file) {
    const products = await this.findOne(id);

    if(file) {
      if(products.imagePath) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(products.imagePath));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      const imagenOriginal = file.buffer;
      const imagenOptimizada = await sharp(imagenOriginal).resize(800).toBuffer();
      const imagePath = path.join(__dirname, '..', 'uploads', file.originalname);
      fs.writeFileSync(imagePath, imagenOptimizada);

      changes.imagePath = `${config.imagesPath}${file.originalname}`;
    }
    await products.update(changes);
    return products;
  }

  async delete(id) {
    const product = await this.findOne(id);
    if(!product) {
      throw boom.notFound('Product not found');
    }
    await product.update({ deleted: true, deletedAt: new Date() });
    return { id };
  }
}

module.exports = ProductService;
