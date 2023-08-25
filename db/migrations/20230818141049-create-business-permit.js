"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BusinessPermits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        type: Sequelize.INTEGER,
      },
      paymentTypeID: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0, //0 processing //1 done
      },
      type: {
        type: Sequelize.INTEGER,
      },
      applicantSignature: {
        type: Sequelize.STRING,
      },
      applicantPosition: {
        type: Sequelize.STRING,
      },
      approvedByMPDC: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByMTO1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByMTO2: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedBySANIDAD: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByMEO: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByMENRO: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByBFP: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByBPLO1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approvedByBPLO2: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      assignedToDepartmentID: {
        type: Sequelize.INTEGER,
      },
      signatureMTO: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signatureBFP: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signatureBPLO: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("BusinessPermits");
  },
};
