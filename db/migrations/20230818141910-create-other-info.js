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
      businessTelephone: {
        type: Sequelize.STRING,
      },
      businessMobile: {
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING,
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
      }, //null when not rented
      lessorAddress: {
        type: Sequelize.STRING,
      },
      lessorMobile: {
        type: Sequelize.STRING,
      },
      lessorEmail: {
        type: Sequelize.STRING,
      },
      buildingName: {
        type: Sequelize.STRING,
      },
      buildingAddress: {
        type: Sequelize.STRING,
      },
      monthlyRental: {
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
    await queryInterface.dropTable("OtherInfos");
  },
};
