"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BusinessActivities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessPermitID: {
        type: Sequelize.INTEGER,
      },
      lineOfBusiness: {
        type: Sequelize.STRING,
      },
      noOfUnits: {
        type: Sequelize.STRING,
      },
      capitalization: {
        type: Sequelize.DOUBLE,
      },
      essentialGross: {
        type: Sequelize.DOUBLE,
      },
      nonEssentialGross: {
        type: Sequelize.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BusinessActivities");
  },
};
