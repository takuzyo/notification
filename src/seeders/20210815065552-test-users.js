'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert('Users', [
      {
        name: 'tarou',
        email: 'taro@example.com',
        role: 'normal',
        password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'zirou',
        email: 'zirou@example.com',
        role: 'manager',
        password: bcrypt.hashSync('secret', bcrypt.genSaltSync(8)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
