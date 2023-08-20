"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "PaymentTypes",
      [
        {
          name: "Anually",
        },
        {
          name: "Semi-Anually",
        },
        {
          name: "Quarterly",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PaymentTypes", null, {});
  },
};
