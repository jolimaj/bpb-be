const { Requirements } = require("../../db/models/index");
const {
  RequirementsMapper,
} = require("../../common/mappers/requirement-mapper");

const { BusinessPermitService } = require("../businessPermit/controller");
const { UsersController } = require("../users/controller");

class RequirementsController {
  #model;
  #mapper;
  #userController;
  #businessController;

  constructor() {
    this.#model = Requirements;
    this.#mapper = new RequirementsMapper();
    this.#userController = new UsersController();
    this.#businessController = new BusinessPermitService();
  }

  async getRequirementsByBusinessPermitID(email) {
    try {
      const { id } = await this.#userController.getUserByID(email);

      const data = await this.#businessController.getBusinessPermitsByUserOnly(
        id
      );
      return await this.#model.findOne({
        where: {
          businessPermitID: data.dataValues.id,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async submitRequirements(imageUrlList, keyName, id) {
    try {
      const result = Object.fromEntries(
        keyName.map((array1value, index) => [array1value, imageUrlList[index]])
      );
      console.log(
        "🚀 ~ file: controller.js:44 ~ RequirementsController ~ submitRequirements ~ result:",
        result
      );
      const data = this.#mapper.submit(result);
      console.log(
        "🚀 ~ file: controller.js:45 ~ RequirementsController ~ submitRequirements ~ data:",
        data
      );
      return await this.#model.update(data, {
        where: {
          businessPermitID: id,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
module.exports = { RequirementsController };
