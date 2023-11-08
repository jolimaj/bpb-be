const { Op } = require("sequelize");
const { responseMessage } = require("../../common/response/code");
const { User, Departments, NotifParams } = require("../../db/models/index");
const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

const { UserMapper } = require("../../common/mappers/user-mapper");

const {
  NotificationService,
} = require("../../common/service/notification-service");
const { SecurePassword } = require("../../helpers/password/secure-password");

const { DepartmentsModule } = require("../departments/controller");
const { NotificationController } = require("../notifcation/controller");

class UsersController {
  #model;
  #mapper;
  #notifService;
  #securePassword;
  #departmentModule;
  #notifModules;
  #notifParams;

  constructor() {
    this.#model = User;
    this.#notifParams = NotifParams;
    this.#mapper = new UserMapper();
    this.#notifService = new NotificationService();
    this.#securePassword = new SecurePassword();
    this.#departmentModule = new DepartmentsModule();
    this.#notifModules = new NotificationController();
  }
  async getUserByID(email) {
    try {
      return await this.#model.findOne({ where: { email }, raw: true });
    } catch (error) {
      return error;
    }
  }

  async updateUserData(email, mobile) {
    try {
      const data = await this.#model.findOne({ where: { email }, raw: true });
      return this.#model.update(
        { mobile },
        {
          where: {
            id: data.id,
          },
          raw: true,
        }
      );
    } catch (error) {
      return error;
    }
  }

  async getAllStaff(query, email) {
    try {
      const queries =
        Object.keys(query).length > 0
          ? {
              where: {
                firstName: query?.firstName,
                roleID: 3,
                email: {
                  [Op.ne]: email,
                },
              },
              limit: 10,
            }
          : {
              where: {
                roleID: 3,
                email: {
                  [Op.ne]: email,
                },
              },
              limit: 10,
            };
      return await this.#model.findAll({
        ...queries,
        include: [{ model: Departments }],
      });
    } catch (error) {
      return error;
    }
  }
  async getAll(query, email) {
    try {
      const queries =
        Object.keys(query).length > 0
          ? {
              where: {
                firstName: {
                  [Op.like]: "%{abc@gmail.com}%",
                },
                email: {
                  [Op.ne]: email,
                },
              },
              limit: query.limit ?? 10,
            }
          : {
              where: {
                email: {
                  [Op.ne]: email,
                },
              },
              limit: query.limit ?? 10,
            };
      return await this.#model.findAll(queries);
    } catch (error) {
      return error;
    }
  }
  async userActivate(id, notifParamsId) {
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
      return error;
    }
  }
  async addPassword(id, password) {
    const request = this.#mapper.createStaffPassword({ password });
    try {
      const result = await this.#model.update(request, {
        where: {
          id,
        },
        raw: true,
        plain: true,
        returning: true,
      });

      await this.#notifService.sendEmailNotification(
        {
          ...result.find(Boolean),
        },
        NOTIF_TYPE.PASSWORD_RESET_SUCCESS
      );
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: controller.js:155 ~ UsersController ~ addPassword ~ error:",
        error
      );
      return error;
    }
  }
  async forgotPassword(payload) {
    try {
      const emailData = await this.#model.findOne({
        where: { email: payload.email },
        raw: true,
      });
      if (!emailData) {
        return Promise.reject(responseMessage.INVALID_EMAIL);
      }

      const notifData = await this.#notifModules.updateQueryParams(
        emailData.id
      );
      await this.#notifService.sendEmailNotification(
        {
          ...payload,
          id: emailData.id,
          notifParamsId: notifData.dataValues.paramsNumber,
        },
        NOTIF_TYPE.PASSWORD_RESET
      );
    } catch (error) {
      return error;
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
  async addStaff(payload) {
    try {
      const request = this.#mapper.createStaff(payload);
      const [result, created] = await this.#model.findOrCreate({
        where: {
          [Op.or]: [{ email: payload.email }, { mobile: payload.mobile }],
        },
        defaults: request,
        raw: true,
      });

      if (!created) {
        return Promise.reject(responseMessage.EMAIL_ALREADY_TAKEN);
      }

      await this.#departmentModule.updateDepartments(result?.dataValues);
      const notifData = await this.#notifModules.addQueryParams(
        result.dataValues.id
      );

      await this.#notifService.sendEmailNotification(
        {
          ...result.dataValues,
          notifParamsId: notifData.dataValues.paramsNumber,
        },
        NOTIF_TYPE.NEW_STAFF,
        payload?.fName
      );
      return result;
    } catch (error) {
      return error;
    }
  }
  async reinviteStaff(id) {
    try {
      const result = await this.#model.findOne({ where: { id }, raw: true });
      const notifData = await this.#notifModules.updateQueryParams(id);
      if (!notifData) {
        return Promise.reject(responseMessage.URL_EXPIRE_MESSAGE);
      }
      await this.#notifService.sendEmailNotification(
        {
          ...result,
          notifParamsId: notifData.dataValues.paramsNumber,
        },
        NOTIF_TYPE.NEW_STAFF
      );
      return notifData;
    } catch (error) {
      return error;
    }
  }
  async registrationUser(payload) {
    try {
      const request = this.#mapper.createUser(payload);
      const [result, created] = await this.#model.findOrCreate({
        where: {
          [Op.or]: [{ email: payload.email }, { mobile: payload.mobile }],
        },
        defaults: request,
      });

      if (!created) {
        return Promise.reject(responseMessage.EMAIL_ALREADY_TAKEN);
      }
      const notifData = await this.#notifModules.addQueryParams(
        result.dataValues.id
      );
      await await this.#notifService.sendEmailNotification(
        {
          ...result.dataValues,
          notifParamsId: notifData.dataValues.paramsNumber,
        },
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

      if (!emailData.isActive) {
        return Promise.reject(responseMessage.ACCOUNT_NOT_ACTIVE);
      }

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

  async logoutUser() {
    return "Logout";
  }

  updateDepartments(payload) {
    const { departmentID, id } = payload;
    try {
      return this.#model.update(
        { departmentID },
        {
          where: {
            id,
          },
          raw: true,
        }
      );
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UsersController };
