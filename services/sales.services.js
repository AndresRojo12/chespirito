const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op, fn, col, Sequelize } = require('sequelize');

class SalesServices {
  async create(data) {
    const newSale = await models.Sales.create(data);
    return newSale;
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
      where.quantitySold = { [Op.eq]: parseInt(filters.quantitySold) };
    }

    if (filters.salePrice) {
      where.salePrice = { [Op.eq]: parseInt(filters.salePrice) };
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
