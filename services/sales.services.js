const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class SalesServices {
  async create(data) {
    const newSale = await models.Sales.create(data);
    return newSale;
  }

  async find() {
    const sales = await models.Sales.findAll({
      include:['products'],
    });
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
