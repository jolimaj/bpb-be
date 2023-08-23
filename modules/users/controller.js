const { Op } = require("sequelize");
const { responseMessage } = require("../../common/response/code");
const { User, Departments } = require("../../db/models/index");
const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

const { UserMapper } = require("../../common/mappers/user-mapper");

const {
  NotificationService,
} = require("../../common/service/notification-service");
const { SecurePassword } = require("../../helpers/password/secure-password");

const { DepartmentsModule } = require("../departments/controller");
class UsersController {
  #model;
  #mapper;
  #notifService;
  #securePassword;
  #departmentModule;

  constructor() {
    this.#model = User;
    this.#mapper = new UserMapper();
    this.#notifService = new NotificationService();
    this.#securePassword = new SecurePassword();
    this.#departmentModule = new DepartmentsModule();
  }
  async getUserByID(email) {
    try {
      return await this.#model.findOne({ where: { email }, raw: true });
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
                firstName: query?.firstName,
                roleID: query?.roleID,
                email: {
                  [Op.ne]: email,
                },
              },
              limit: query.limit ?? 10,
            }
          : {
              where: {
                roleID: query?.roleID,
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
  async addPassword(id, password) {
    try {
      const request = this.#mapper.createStaffPassword({ password });

      return await this.#model.update(request, {
        where: {
          id,
        },
        raw: true,
      });
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
      this.#notifService.sendEmailNotification(
        result,
        NOTIF_TYPE.NEW_STAFF,
        payload?.fName
      );
      return result;
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

      this.#notifService.sendEmailNotification(
        result,
        NOTIF_TYPE.UPON_CREATION,
        payload?.fName
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
