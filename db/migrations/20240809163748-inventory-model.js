'use strict';

const {InventorySchema, INVENTORY_TABLE} = require('./../models/inventory.model')
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(INVENTORY_TABLE, InventorySchema);
  },

  async down (queryInterface) {
   await queryInterface.drop(INVENTORY_TABLE);
  }
};

