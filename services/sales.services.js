const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op, fn, col, Sequelize } = require('sequelize');
const { createSaleSchema } = require('../schemas/sales.schema');

class SalesServices {
  async create(data) {
    const { error, value } = createSaleSchema.validate(data);
    if (error) {
      throw boom.badRequest(error.details[0].message);
    }

    try {
      const newSale = await models.Sales.create(data);
      return newSale;
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

  async find({ page = 1, pageSize = 10, filters = {} } = {}) {
    const limit = parseInt(pageSize || 10);
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const where = {};

    if (filters.categoryName) {
      where['$products.category.name$'] = {
        [Op.iLike]: `%${filters.categoryName}%`,
      };
    }

    if (filters.productName) {
      where['$products.name$'] = {
        [Op.iLike]: `%${filters.productName}%`,
      };
    }

    if (filters.categoryId) {
      where.categoryId = { [Op.eq]: parseInt(filters.categoryId) };
    }

    if (filters.productId) {
      where.productId = { [Op.eq]: parseInt(filters.productId) };
    }

    if (filters.quantitySold) {
      const quantity = parseInt(filters.quantitySold, 10);
      if (!isNaN(quantity)) {
        where.quantitySold = {
          [Op.gte]: quantity - 10,
          [Op.lte]: quantity + 10,
        };
      }
    }

    if (filters.salePrice) {
      const price = parseInt(filters.salePrice, 10);
      if (!isNaN(price)) {
        where.salePrice = {
          [Op.gte]: price - 10,
          [Op.lte]: price + 10,
        };
      }
    }

    if (filters.createdAt) {
      const formattedDate = `%${filters.createdAt}%`;
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(fn('TO_CHAR', col('Sales.created_at'), 'DD/MM/YYYY'), {
          [Op.iLike]: formattedDate,
        }),
      ];
    }

    const { count, rows } = await models.Sales.findAndCountAll({
      where,
      include: [
        {
          model: models.Product,
          as: 'products',
          include: [
            {
              model: models.Category,
              as: 'category',
            },
          ],
        },
      ],
      limit,
      offset,
    });

    if (count === 0) {
      throw boom.notFound('No se encontraron coincidencias');
    }

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPages: parseInt(page) || 1,
      data: rows,
    };
  }

  async findAll() {
    const sales = await models.Sales.findAll();
    return sales;
  }

  async findOne(id) {
    const sale = await models.Sales.findByPk(id);
    if (!sale) {
      throw boom.notFound('Sale not found');
    }
    return sale;
  }
}

module.exports = SalesServices;
