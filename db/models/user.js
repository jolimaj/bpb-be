"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Roles, { foreignKey: "roleID" });
      this.hasOne(models.NotifParams, { foreignKey: "userID" });
      this.belongsTo(models.Departments, { foreignKey: "departmentID" });
    }
  }
  User.init(
    {
      roleID: DataTypes.INTEGER,
      departmentID: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
