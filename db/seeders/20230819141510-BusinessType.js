"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "BusinessTypes",
      [
        {
          name: "Single",
        },
        {
          name: "Partnership",
        },
        {
          name: "Corporation",
        },
        {
          name: "Cooperative",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("BusinessTypes", null, {});
  },
};
