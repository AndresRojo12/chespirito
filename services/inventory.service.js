const boom = require('@hapi/boom');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');

class InventoryService {
  async create(data) {
    const inventory = await models.Inventory.create(data);
    return inventory
  }

  async find() {
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
