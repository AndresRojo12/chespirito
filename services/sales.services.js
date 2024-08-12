const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class SalesServices {
  async create(data) {
    const newSale = await models.Sales.create(data);
    return newSale;
  }

  async find({ page = 1, pageSize = 10 } = {}) {
    const limit = parseInt(pageSize || 10);
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const { count, rows } = await models.Sales.findAndCountAll({
      include: ['category'],
      limit,
      offset,
    });

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
