const boom = require('@hapi/boom');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');

class InventoryService {
  async create(data) {
    const inventory = await models.Inventory.create(data);
    return inventory
  }

  async find() {

  }

  async findOne() {

  }

  async update() {

  }

  async delete() {

  }
}

module.exports = InventoryService;
