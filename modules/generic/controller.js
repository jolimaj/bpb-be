const {
  BusinessType,
  PaymentType,
  Departments,
} = require("../../db/models/index");

class GenericModule {
  async getBusinessType() {
    try {
      return await BusinessType.findAll();
    } catch (error) {
      return error;
    }
  }
  async getPaymentType() {
    try {
      return await PaymentType.findAll();
    } catch (error) {
      return error;
    }
  }
  async getDepartments() {
    try {
      return await Departments.findAll();
    } catch (error) {
      return error;
    }
  }
}
module.exports = { GenericModule };
