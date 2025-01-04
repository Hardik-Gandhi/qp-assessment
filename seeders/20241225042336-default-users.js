'use strict';

const { generateHash } = require('../src/service/utils.service');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [[[adminRole]], [[userRole]]] = await Promise.all([
      queryInterface.sequelize.query(
        `SELECT id FROM "Role" WHERE "name" = 'ADMIN';`
      ),
      queryInterface.sequelize.query(
        `SELECT id FROM "Role" WHERE "name" = 'USER';`
      ),
    ]);

    return queryInterface.bulkInsert('User', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@gmail.com',
        password: await generateHash('admin@123'),
        roleId: adminRole?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'user@gmail.com',
        password: await generateHash('user@123'),
        roleId: userRole?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
