"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          roleID: 1,
          firstName: "Admin",
          lastName: "Admin",
          email: "bpbbusinesspermitngbayan@gmail.com",
          mobile: "09514238553",
          isActive: true,
          password:
            "$2a$12$Bo4qMPi6idAbwpvSoSTBouIWssR2y6kFIbIbEXlPFIzABmIzcedqO",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
