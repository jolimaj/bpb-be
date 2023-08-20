"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BasicInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessPermitID: {
        type: Sequelize.INTEGER,
      },
      dateOfApplication: {
        type: Sequelize.DATE,
      },
      dtiRegNo: {
        type: Sequelize.DOUBLE,
      },
      dtiRegDate: {
        type: Sequelize.DATE,
      },
      tinNo: {
        type: Sequelize.DOUBLE,
      },
      businessTypeID: {
        type: Sequelize.INTEGER,
      },
      enjoyTaxIncentive: {
        type: Sequelize.BOOLEAN,
      },
      notEnjoyTaxIncentive: {
        type: Sequelize.STRING,
      },
      taxPayerName: {
        type: Sequelize.STRING,
      },
      businessName: {
        type: Sequelize.STRING,
      },
      tradeFranchiseName: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("BasicInfos");
  },
};
