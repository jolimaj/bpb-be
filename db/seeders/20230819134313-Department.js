"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Departments",
      [
        {
          name: "Business permit licensing office",
          code: "BPLO",
        },
        {
          name: "Municipal Planning and Development Coordinator",
          code: "MPDC",
        },
        {
          name: "Municipal Treasurer's office",
          code: "MTO",
        },
        {
          name: "Municipal Environmental and Natural Resources Office",
          code: "MENRO",
        },
        {
          name: "Municipal Engineering Office",
          code: "MEO",
        },
        {
          name: "Municipal Health Office (Sanitation)",
          code: "SANIDAD",
        },
        {
          name: "Bureu of Fire Protection",
          code: "BFP",
        },
      ],
      { fields: ["name"], ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departments", null, {});
  },
};
