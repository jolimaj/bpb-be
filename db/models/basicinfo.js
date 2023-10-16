"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BasicInfo extends Model {
    static associate(models) {
      this.belongsTo(models.BusinessType, { foreignKey: "businessTypeID" });
    }
  }
  BasicInfo.init(
    {
      businessPermitID: DataTypes.INTEGER,
      dateOfApplication: DataTypes.DATE,
      dtiRegNo: DataTypes.DOUBLE,
      dtiRegDate: DataTypes.DATE,
      tinNo: DataTypes.INTEGER,
      businessTypeID: DataTypes.INTEGER,
      enjoyTaxIncentive: DataTypes.BOOLEAN,
      notEnjoyTaxIncentive: DataTypes.STRING, // optional must be fill when enjoyTaxIncentive is no
      taxPayerName: DataTypes.STRING, // tax Payer
      businessName: DataTypes.STRING,
      tradeFranchiseName: DataTypes.STRING,
      amendementFrom: DataTypes.STRING,
      amendementTo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BasicInfo",
    }
  );
  return BasicInfo;
};
