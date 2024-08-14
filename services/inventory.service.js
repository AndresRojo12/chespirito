const boom = require('@hapi/boom');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');

class InventoryService {
  async create(data) {
    const inventory = await models.Inventory.create(data);
    return inventory
  }

  async find({page = 1, pageSize = 10} = {}) {

    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const { count, rows } = await models.Inventory.findAndCountAll({
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

  async findAll () {
    const inventory = await models.Inventory.findAll();
    return inventory;
  }


  async findOne(id) {
    const inventory = await models.Inventory.findByPk(id);
    if(!inventory) {
      throw boom.notFound('Inventory not found');
    }
    return inventory;
  }

  async update() {

  }

  async delete() {

  }
}

module.exports = InventoryService;
