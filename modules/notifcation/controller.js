const uuid = require("uuid").v4;
const { NotifParams } = require("../../db/models/index");

class NotificationController {
  #model;

  constructor() {
    this.#model = NotifParams;
  }

  async addQueryParams(id) {
    try {
      const result = await this.#model.create({
        paramsNumber: uuid(),
        userID: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { NotificationController };
