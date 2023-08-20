"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessPermit extends Model {
    static associate(models) {
      this.hasMany(models.BasicInfo, { foreignKey: "businessPermitID" });
      this.hasMany(models.OtherInfo, { foreignKey: "businessPermitID" });
      this.hasMany(models.BusinessActivity, { foreignKey: "businessPermitID" });
      this.hasMany(models.Requirements, { foreignKey: "businessPermitID" });
      this.belongsTo(models.PaymentType, { foreignKey: "paymentTypeID" });
    }
  }
  BusinessPermit.init(
    {
      userID: DataTypes.INTEGER,
      paymentTypeID: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      type: DataTypes.INTEGER, //1 new 2 renewal
      applicantSignature: DataTypes.STRING,
      applicantPosition: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BusinessPermit",
    }
  );
  return BusinessPermit;
};
