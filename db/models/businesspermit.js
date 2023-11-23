"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessPermit extends Model {
    static associate(models) {
      this.hasMany(models.BasicInfo, { foreignKey: "businessPermitID" });
      this.hasMany(models.OtherInfo, { foreignKey: "businessPermitID" });
      this.hasMany(models.BusinessActivity, { foreignKey: "businessPermitID" });
      this.hasMany(models.Requirements, { foreignKey: "businessPermitID" });
      this.hasMany(models.BFPForm, { foreignKey: "businessPermitID" });
      this.belongsTo(models.PaymentType, { foreignKey: "paymentTypeID" });
      this.belongsTo(models.User, { foreignKey: "userID" });
    }
  }
  BusinessPermit.init(
    {
      userID: DataTypes.INTEGER,
      paymentTypeID: DataTypes.INTEGER,
      status: DataTypes.INTEGER, //
      type: DataTypes.INTEGER, //1 new 2 renewal
      applicantSignature: DataTypes.STRING,
      applicantPosition: DataTypes.STRING,
      assignedToDepartmentID: DataTypes.INTEGER,
      approvedByMPDC: DataTypes.BOOLEAN,
      approvedByMTO1: DataTypes.BOOLEAN,
      approvedByMTO2: DataTypes.BOOLEAN,
      approvedBySANIDAD: DataTypes.BOOLEAN,
      approvedByMEO: DataTypes.BOOLEAN,
      approvedByMENRO: DataTypes.BOOLEAN,
      approvedByBFP: DataTypes.BOOLEAN,
      approvedByBPLO1: DataTypes.BOOLEAN,
      approvedByBPLO2: DataTypes.BOOLEAN,
      signatureMTO: DataTypes.STRING,
      signatureBFP: DataTypes.STRING,
      signatureBPLO: DataTypes.STRING,
      approvedDate: DataTypes.DATE,
      queueNo: DataTypes.STRING,
      qrCode: DataTypes.STRING,
      certificate: DataTypes.STRING,
      isRelease: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "BusinessPermit",
    }
  );
  return BusinessPermit;
};
