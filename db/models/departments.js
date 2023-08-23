"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    static associate(models) {
      this.hasOne(models.User, { foreignKey: "departmentID" });
    }
  }
  Departments.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Departments",
    }
  );
  return Departments;
};
