"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("BusinessPermits", "isRelease", {
        type: Sequelize.BOOLEAN,
        defaultValue: false, //0 processing //1 done
      }),
      queryInterface.addColumn("BusinessPermits", "certificate", {
        type: Sequelize.STRING,
        allowNull: true, //0 processing //1 done
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("BusinessPermits", "isRelease", {
        type: Sequelize.BOOLEAN,
        defaultValue: false, //0 processing //1 done
      }),
      queryInterface.addColumn("BusinessPermits", "certificate", {
        type: Sequelize.STRING,
        allowNull: true, //0 processing //1 done
      }),
    ]);
  },
};
