"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QueueNos extends Model {
    static associate(models) {}
  }
  QueueNos.init(
    {
      scheduleDate: DataTypes.DATE,
      userID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "QueueNos",
    }
  );
  return QueueNos;
};
