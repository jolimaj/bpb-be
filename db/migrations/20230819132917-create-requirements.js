"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Requirements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessPermitID: {
        type: Sequelize.INTEGER,
      },
      brgyBusinessClearance: {
        type: Sequelize.STRING,
      },
      dtiReg: {
        type: Sequelize.STRING,
      },
      locationalClearance: {
        type: Sequelize.STRING, //zoning
      },
      leaseContract: {
        type: Sequelize.STRING,
        allowNull: true,
      }, //optional
      picture: {
        type: Sequelize.STRING,
      },
      certOfCompliance: {
        type: Sequelize.STRING,
      },
      nationalAgencyAccredetation: {
        type: Sequelize.STRING,
        allowNull: true,
      }, //optional
      marketClearance: {
        type: Sequelize.STRING,
        allowNull: true,
      }, //optional
      homeOwnersClearance: {
        type: Sequelize.STRING,
        allowNull: true,
      }, //optional
      cedula: {
        type: Sequelize.STRING,
      },
      buidingpermit: {
        type: Sequelize.STRING,
      },
      sanityPermit: {
        type: Sequelize.STRING,
      },
      menroCert: {
        type: Sequelize.STRING,
      },
      fireSafetyCert: {
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
    await queryInterface.dropTable("Requirements");
  },
};
