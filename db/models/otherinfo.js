"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OtherInfo extends Model {
    static associate(models) {
      // define association here
    }
  }
  OtherInfo.init(
    {
      businessPermitID: DataTypes.INTEGER,
      businessAddress: DataTypes.STRING,
      businessPostalCode: DataTypes.INTEGER,
      businessTelephone: DataTypes.INTEGER,
      businessMobile: DataTypes.DOUBLE,
      businessEmail: DataTypes.STRING, // optional
      ownersAddress: DataTypes.STRING,
      ownersPostalCode: DataTypes.INTEGER,
      ownersTelephone: DataTypes.INTEGER,
      ownersMobile: DataTypes.DOUBLE,
      ownersEmail: DataTypes.STRING, // optional
      emergencyPerson: DataTypes.STRING,
      emergencyAddress: DataTypes.STRING,
      emergencyMobile: DataTypes.DOUBLE,
      businessArea: DataTypes.INTEGER,
      femaleEmployee: DataTypes.INTEGER,
      maleEmployee: DataTypes.INTEGER,
      lguEmployee: DataTypes.INTEGER,
      lessorName: DataTypes.STRING, //null when not rented
      lessorAddress: DataTypes.STRING,
      lessorMobile: DataTypes.DOUBLE,
      lessorEmail: DataTypes.STRING,
      buildingName: DataTypes.STRING,
      buildingAddress: DataTypes.STRING,
      monthlyRental: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "OtherInfo",
    }
  );
  return OtherInfo;
};
