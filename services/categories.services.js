const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');

class CategoryService {
  async create(data, file) {
    const { name, description } = data;
    const imagenOriginal = file.buffer;

    const imagenOptimizada = await sharp(imagenOriginal).resize(800).toBuffer();

    const imagePath = path.join(__dirname, '..', 'uploads', file.originalname);
    fs.writeFileSync(imagePath, imagenOptimizada);

    const categoryData = {
      name,
      description,
      imagePath: `${config.imagesPath}${file.originalname}`,
    };

    const category = await models.Category.create(categoryData);

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
      where: {
        deleted:false
      },
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
    const categories = await models.Category.findAll();
    return categories;
  }


  async search(query) {
    const categories = await models.Category.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      }
    });
    return categories;
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

  async update(id, changes, file) {
    const category = await this.findOne(id);

    if(file) {
      if(category.imagePath) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(category.imagePath));
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
    await category.update(changes);
    return category;
  }

  async delete(id) {
    const category = await this.findOne(id);
    if(!category) {
      throw boom.notFound('Product not found');
    }
    await category.update({ deleted: true, deletedAt: new Date() });
    return { id };
  }
}

module.exports = CategoryService;
