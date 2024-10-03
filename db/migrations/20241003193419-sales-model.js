'use strict';

const { SALES_TABLE, SalesSchema } = require('../models/sales.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(SALES_TABLE, SalesSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(SALES_TABLE);
  },
};
