const boom = require('@hapi/boom');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

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
      imagePath: `http://localhost:3001/uploads/${file.originalname}`,
    };

    const category = await models.Category.create(categoryData);

    return category;
  }

  async find() {
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
      // include: ['products'],
    });
    if (!category) {
      throw boom.notFound('Category not found');
    }
    return category;
  }

  async update(id, changes) {
    const category = await this.findOne(id);
    await category.update(changes);
    return category;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return { id };
  }
}

module.exports = CategoryService;
