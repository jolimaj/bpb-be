"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    static associate(models) {
      this.hasOne(models.Users, { foreignKey: "userID" });
    }
  }
  Departments.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Departments",
    }
  );
  return Departments;
};
