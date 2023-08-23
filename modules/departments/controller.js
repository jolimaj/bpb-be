const { Departments, User } = require("../../db/models/index");
class DepartmentsModule {
  #model;
  #userModel;
  constructor() {
    this.#model = Departments;
    this.#userModel = User;
  }

  getDepartmentsById(id) {
    try {
      return this.#model.findOne({
        where: { id },
      });
    } catch (error) {
      return error;
    }
  }
  getDepartments(query) {
    try {
      const queries =
        Object.keys(query).length > 0
          ? {
              where: {
                code: query?.code,
              },
              limit: 10,
            }
          : {
              limit: 10,
            };
      return this.#model.findAll({
        ...queries,
        include: [
          {
            model: User,
          },
        ],
      });
    } catch (error) {
      return error;
    }
  }
  updateDepartments(payload) {
    try {
      return this.#model.update(
        { userId: payload?.id },
        {
          where: {
            id: payload?.departmentID,
          },
          raw: true,
        }
      );
    } catch (error) {
      return error;
    }
  }
}
module.exports = { DepartmentsModule };
