"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Requirements extends Model {
    static associate(models) {}
  }
  Requirements.init(
    {
      businessPermitID: DataTypes.INTEGER,
      brgyBusinessClearance: DataTypes.STRING,
      dtiReg: DataTypes.STRING,
      locationalClearance: DataTypes.STRING,
      leaseContract: DataTypes.STRING, //optional
      picture: DataTypes.STRING,
      certOfCompliance: DataTypes.STRING,
      nationalAgencyAccredetation: DataTypes.STRING, //optional
      marketClearance: DataTypes.STRING, //optional
      homeOwnersClearance: DataTypes.STRING, //optional
      cedula: DataTypes.STRING,
      buidingpermit: DataTypes.STRING,
      sanityPermit: DataTypes.STRING,
      menroCert: DataTypes.STRING,
      fireSafetyCert: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Requirements",
    }
  );
  return Requirements;
};
