const { Op } = require("sequelize");
const { responseMessage } = require("../../common/response/code");
const { User } = require("../../db/models/index");
const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

const { UserMapper } = require("../../common/mappers/user-mapper");

const {
  NotificationService,
} = require("../../common/service/notification-service");

class UsersController {
  #model;
  #mapper;
  #notifService;

  constructor() {
    this.#model = User;
    this.#mapper = new UserMapper();
    this.#notifService = new NotificationService();
  }
  async getAll(option) {
    try {
      return await this.#model.findAll();
    } catch (error) {
      retur;
    }
  }
  async registrationUser(payload) {
    try {
      const request = this.#mapper.createUser(payload);
      const [result, created] = await this.#model.findOrCreate({
        where: {
          [Op.or]: [{ email: payload.email }, { mobile: payload.phone }],
        },
        defaults: request,
      });

      if (!created) {
        return Promise.reject(responseMessage.EMAIL_ALREADY_TAKEN);
      }

      this.#notifService.sendEmailNotification(
        request,
        NOTIF_TYPE.UPON_CREATION
      );
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UsersController };
