"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OtherInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessPermitID: {
        type: Sequelize.INTEGER,
      },
      businessAddress: {
        type: Sequelize.STRING,
      },
      businessPostalCode: {
        type: Sequelize.INTEGER,
      },
      businessTelephone: {
        type: Sequelize.STRING,
      },
      businessMobile: {
        type: Sequelize.DOUBLE,
      },
      businessEmail: {
        type: Sequelize.STRING,
      }, // optional
      ownersAddress: {
        type: Sequelize.STRING,
      },
      ownersPostalCode: {
        type: Sequelize.INTEGER,
      },
      ownersTelephone: {
        type: Sequelize.INTEGER,
      },
      ownersMobile: {
        type: Sequelize.DOUBLE,
      },
      ownersEmail: {
        type: Sequelize.STRING,
      }, // optional
      emergencyPerson: {
        type: Sequelize.STRING,
      },
      emergencyAddress: {
        type: Sequelize.STRING,
      },
      emergencyMobile: {
        type: Sequelize.DOUBLE,
      },
      businessArea: {
        type: Sequelize.INTEGER,
      },
      femaleEmployee: {
        type: Sequelize.INTEGER,
      },
      maleEmployee: {
        type: Sequelize.INTEGER,
      },
      lguEmployee: {
        type: Sequelize.INTEGER,
      },
      lessorName: {
        type: Sequelize.STRING,
        defaultValue: null,
      }, //null when not rented
      lessorAddress: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      lessorMobile: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      lessorEmail: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      buildingName: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      buildingAddress: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      monthlyRental: {
        type: Sequelize.DOUBLE,
        defaultValue: null,
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
    await queryInterface.dropTable("OtherInfos");
  },
};
