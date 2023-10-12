const uuid = require("uuid").v4;
const { NotifParams } = require("../../db/models/index");
const { responseMessage } = require("../../common/response/code");

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
  async updateQueryParams(userID) {
    try {
      const result = await this.#model.update(
        {
          paramsNumber: uuid(),
        },
        {
          where: {
            userID,
          },
          returning: true,
          plain: true,
        }
      );
      return result.find(Boolean);
    } catch (error) {
      return error;
    }
  }

  async getQueryParams(paramsNumber) {
    const checkExpiry = await this.#model.findOne({
      where: { paramsNumber },
      raw: true,
    });

    if (
      !checkExpiry ||
      new Date(checkExpiry.createdAt).getDate() < new Date().getDate()
    ) {
      return Promise.reject(responseMessage.URL_EXPIRE_MESSAGE);
    }
    return checkExpiry;
  }
}

module.exports = { NotificationController };
