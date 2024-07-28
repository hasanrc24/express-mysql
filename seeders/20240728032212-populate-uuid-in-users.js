'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // const users = await queryInterface.sequelize.query(
    //   'SELECT id FROM Users',
    //   { type: Sequelize.QueryTypes.SELECT }
    // );
    const User = queryInterface.sequelize.define('User', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      }
    });

    const users = await User.findAll();

    for (const user of users) {
      // await queryInterface.sequelize.query(
      //   'UPDATE Users SET uuid = :uuid WHERE id = :id',
      //   {
      //     replacements: { uuid: uuidv4(), id: user.id },
      //     type: Sequelize.QueryTypes.UPDATE,
      //   }
      // );
      await user.update({ uuid: uuidv4() })
    }
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
