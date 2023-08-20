"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessActivity extends Model {
    static associate(models) {}
  }
  BusinessActivity.init(
    {
      businessPermitID: DataTypes.INTEGER,
      lineOfBusiness: DataTypes.STRING,
      noOfUnits: DataTypes.STRING,
      capitalization: DataTypes.DOUBLE,
      essentialGross: DataTypes.DOUBLE,
      nonEssentialGross: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "BusinessActivity",
    }
  );
  return BusinessActivity;
};
