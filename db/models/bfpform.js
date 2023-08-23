"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BFPForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BFPForm.init(
    {
      businessPermitID: DataTypes.INTEGER,
      ownersName: DataTypes.STRING,
      businessName: DataTypes.STRING,
      totalFloorArea: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BFPForm",
    }
  );
  return BFPForm;
};
