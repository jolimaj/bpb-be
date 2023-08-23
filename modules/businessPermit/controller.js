const {
  BasicInfo,
  BusinessActivity,
  OtherInfo,
  BusinessPermit,
  BFPForm,
  Departments,
  Requirements,
} = require("../../db/models/index");

const { UsersController } = require("../users/controller");

const {
  BusinessPermitMapper,
} = require("../../common/mappers/business-permit-mapper");
const {
  APPLICATION_TYPES,
  DEPARTMENT_ID,
} = require("../../common/constant/business-permit-constant");

class BusinessPermitService {
  #model;
  #departmentModel;
  #mapper;
  #basicInfoModel;
  #otherInfoModel;
  #businessActivityModel;
  #bfpForm;
  #userData;
  #requirement;

  constructor() {
    this.#mapper = new BusinessPermitMapper();
    this.#model = BusinessPermit;
    this.#basicInfoModel = BasicInfo;
    this.#otherInfoModel = OtherInfo;
    this.#businessActivityModel = BusinessActivity;
    this.#bfpForm = BFPForm;
    this.#userData = new UsersController();
    this.#departmentModel = Departments;
    this.#requirement = Requirements;
  }

  async applyBusinessPermit(payload, email) {
    try {
      const userData = await this.#userData.getUserByID(email);
      payload.userID = userData.id;
      const businessPermits = this.#mapper.apply(payload);
      const businessPermitResult = await this.#model.create(businessPermits, {
        raw: true,
      });
      payload.id = businessPermitResult.dataValues.id;

      const basicInfo = this.#mapper.basicInfo(payload);
      const basicInfoResult = await this.#basicInfoModel.create(basicInfo, {
        raw: true,
      });

      const otherInfo = this.#mapper.otherInfo(payload);
      const otherInfoResult = await this.#otherInfoModel.create(otherInfo, {
        raw: true,
      });

      const businessActivity = this.#mapper.businessActivity(payload);
      const businessActivityResult =
        await this.#businessActivityModel.bulkCreate(businessActivity, {
          raw: true,
        });

      const bfp = this.#mapper.bfpForm(payload);

      const bfpResult = await this.#bfpForm.create(bfp, {
        raw: true,
      });
      const requirementResult = await this.#requirement.create(
        { businessPermitID: payload.id },
        {
          raw: true,
        }
      );
      return {
        businessPermitResult,
        basicInfoResult,
        otherInfoResult,
        businessActivityResult,
        bfpResult,
        requirementResult,
      };
    } catch (error) {
      return error;
    }
  }

  async getBusinessPermitByUser(userID, id) {
    try {
      const queries = {
        where: {
          businessPermitID: id,
        },
      };

      const businessPermitResult = await this.#model.findOne(
        {
          where: {
            userID,
            id,
          },
        },
        {
          raw: true,
        }
      );
      const basicInfoResult = await this.#basicInfoModel.findOne(queries, {
        raw: true,
      });

      const otherInfoResult = await this.#otherInfoModel.findOne(queries, {
        raw: true,
      });

      return { businessPermitResult, basicInfoResult, otherInfoResult };
    } catch (error) {
      return error;
    }
  }
  async getBusinessPermits(query, email) {
    try {
      const { id } = await this.#userData.getUserByID(email);
      const departmentData = await this.#departmentModel.findOne({
        where: {
          userId: id,
        },
        raw: true,
      });
      const queries = query?.id
        ? {
            where: {
              assignedToDepartmentID: departmentData.id,
              id: query?.id,
            },
            limit: query?.limit ?? 10,
          }
        : {
            where: {
              assignedToDepartmentID: departmentData.id,
            },
            limit: query?.limit ?? 10,
          };

      const results = await this.#model.findAll({
        ...queries,
        include: [
          { model: BasicInfo },
          { model: OtherInfo },
          { model: BusinessActivity },
          { model: BFPForm },
          { model: Requirements },
        ],
        order: [["id", "DESC"]],
      });
      return results;
    } catch (error) {
      return error;
    }
  }
  async getBusinessPermitsByUserOnly(userID) {
    try {
      const results = await this.#model.findOne({
        where: { userID },
      });
      return results;
    } catch (error) {
      return error;
    }
  }

  async getBusinessPermitByID(id) {
    try {
      const queries = {
        where: {
          id,
        },
      };

      const businessPermitResult = await this.#model.findOne(queries, {
        raw: true,
      });

      return businessPermitResult;
    } catch (error) {
      return error;
    }
  }
  async reviewByMPDC(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.MTO;
      payload.approvedByMPDC = true;

      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByMTOFirst(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
      if (payload.type === APPLICATION_TYPES.RENEW) {
        payload.assignedToDepartmentID = DEPARTMENT_ID.BFP;
      }
      payload.approvedByMTO1 = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewBySANIDAD(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.MEO;
      if (payload.type === APPLICATION_TYPES.RENEW) {
        payload.assignedToDepartmentID = DEPARTMENT_ID.BPLO;
      }
      payload.approvedBySANIDAD = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByMEO(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.MTO;
      payload.approvedByMEO = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }

  async reviewByMTOSecond(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.MENRO;
      payload.approvedByMTO2 = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByMENRO(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.BFP;
      payload.approvedByMENRO = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByBFP(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.BPLO;
      payload.approvedByBFP = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByBPLOFirst(id, payload) {
    try {
      if (payload.type === APPLICATION_TYPES.RENEW) {
        payload.assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
      }
      payload.approvedByBPLO1 = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
  async reviewByBPLOSecond(id, payload) {
    try {
      payload.assignedToDepartmentID = DEPARTMENT_ID.MTO;
      payload.approvedByBPLO2 = true;
      const reviewed = await this.#model.update(payload, { where: { id } });
      return reviewed;
    } catch (error) {
      return error;
    }
  }
}
module.exports = { BusinessPermitService };
