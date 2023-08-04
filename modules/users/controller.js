const { Op } = require("sequelize");
const { responseMessage } = require("../../common/response/code");
const { User } = require("../../db/models/index");
const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

const { UserMapper } = require("../../common/mappers/user-mapper");

const {
  NotificationService,
} = require("../../common/service/notification-service");
const { SecurePassword } = require("../../helpers/password/secure-password");
class UsersController {
  #model;
  #mapper;
  #notifService;
  #securePassword;

  constructor() {
    this.#model = User;
    this.#mapper = new UserMapper();
    this.#notifService = new NotificationService();
    this.#securePassword = new SecurePassword();
  }
  async getAll(options) {
    try {
      return await this.#model.findAll({ where: { options }, limit: 10 });
    } catch (error) {
      return error;
    }
  }
  async userActivate(id) {
    try {
      return await this.#model.update(
        { isActive: true },
        {
          where: {
            id,
          },
        }
      );
    } catch (error) {
      retur;
    }
  }

  async uploadImage(id) {
    try {
      return await this.#model.update(
        { isActive: true },
        {
          where: {
            id,
          },
        }
      );
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
  async loginUser(payload) {
    try {
      const emailData = await this.#model.findOne({
        where: { email: payload.email },
        raw: true,
      });

      if (!emailData) {
        return Promise.reject(responseMessage.INVALID_EMAIL);
      }

      const passwordData = this.#securePassword.decryptPassword(
        payload?.password,
        emailData.password
      );

      if (!passwordData) {
        return Promise.reject(responseMessage.INVALID_PASSWORD);
      }
      return emailData;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UsersController };
