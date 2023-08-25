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
      { fields: ["name"], ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("BusinessTypes", null, {});
  },
};
