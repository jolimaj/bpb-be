"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentType extends Model {
    static associate(models) {}
  }
  PaymentType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PaymentType",
    }
  );
  return PaymentType;
};
