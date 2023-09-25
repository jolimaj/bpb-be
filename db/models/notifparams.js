"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NotifParams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NotifParams.init(
    {
      userID: DataTypes.INTEGER,
      paramsNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NotifParams",
    }
  );
  return NotifParams;
};
