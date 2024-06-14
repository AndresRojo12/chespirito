'use strict';

const bcrypt = require('bcrypt');
const { config } = require('../../config/config');

module.exports = {
  up: async (queryInterface) => {
    const adminPasswordHash = await bcrypt.hash(config.passwordAdmin, 10);

    await queryInterface.bulkInsert('users', [
      {
        email: config.emailAdmin,
        password: adminPasswordHash,
        role: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: [config.emailSuperAdmin, config.emailAdmin]
    }, {});
  },
};
