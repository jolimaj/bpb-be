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
  async renewBusinessPermit(payload, email) {
    try {
      const userData = await this.#userData.getUserByID(email);
      payload.userID = userData.id;
      payload.type = APPLICATION_TYPES.NEW;
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
  async getBusinessPermits(query, email, types) {
    try {
      const type =
        types === "new" ? APPLICATION_TYPES.NEW : APPLICATION_TYPES.RENEW;
      const { departmentID } = await this.#userData.getUserByID(email);

      const queries = query?.id
        ? {
            where: {
              assignedToDepartmentID: departmentID,
              id: query?.id,
              type,
            },
            limit: query?.limit ?? 10,
          }
        : {
            where: {
              assignedToDepartmentID: departmentID,
              type,
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

  #assigneeNewPermit(assignee, payload, body) {
    let assignedToDepartmentID,
      approvedByMPDC,
      approvedByMTO1,
      approvedByMTO2,
      approvedByBPLO1,
      approvedByMEO,
      approvedByMENRO,
      approvedBySANIDAD,
      approvedByBFP,
      status,
      signatureMTO,
      signatureBFP,
      signatureBPLO;
    switch (assignee) {
      case DEPARTMENT_ID.MPDC:
        assignedToDepartmentID = DEPARTMENT_ID.MTO;
        approvedByMPDC = true;
        break;
      case DEPARTMENT_ID.MTO:
        if (payload?.approvedByMTO1) {
          assignedToDepartmentID = DEPARTMENT_ID.MENRO;
          approvedByMTO2 = true;
          signatureMTO = body?.signatureMTO;
        }

        assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
        approvedByMTO1 = true;
        break;
      case DEPARTMENT_ID.SANIDAD:
        assignedToDepartmentID = DEPARTMENT_ID.MEO;
        approvedBySANIDAD = true;
        break;
      case DEPARTMENT_ID.MEO:
        assignedToDepartmentID = DEPARTMENT_ID.MTO;
        approvedByMEO = true;
        break;
      case DEPARTMENT_ID.MENRO:
        assignedToDepartmentID = DEPARTMENT_ID.BFP;
        approvedByMENRO = true;
        break;
      case DEPARTMENT_ID.BFP:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        approvedByBFP = true;
        signatureBFP = body?.signatureBFP;
        break;
      case DEPARTMENT_ID.BPLO:
        approvedByBPLO1 = true;
        status = 1;
        signatureBPLO = body?.signatureBPLO;
        break;
    }
    return {
      assignedToDepartmentID,
      approvedByMPDC,
      approvedByMTO1,
      approvedByMTO2,
      approvedByBPLO1,
      approvedByMEO,
      approvedByMENRO,
      approvedBySANIDAD,
      approvedByBFP,
      status,
      signatureMTO,
      signatureBFP,
      signatureBPLO,
    };
  }
  #assigneeRenewalPermit(assignee, payload, body) {
    let assignedToDepartmentID;
    let approvedByMTO1,
      approvedByBPLO1,
      approvedByBPLO2,
      approvedBySANIDAD,
      approvedByBFP,
      status,
      signatureMTO,
      signatureBFP,
      signatureBPLO;
    switch (assignee) {
      case DEPARTMENT_ID.BPLO:
        if (payload.approvedByBPLO1) {
          assignedToDepartmentID = DEPARTMENT_ID.MTO;
          approvedByBPLO2 = true;
          signatureBPLO = body?.signatureBPLO;
        }
        assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
        approvedByBPLO1 = true;
        break;
      case DEPARTMENT_ID.SANIDAD:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        approvedBySANIDAD = true;
        break;
      case DEPARTMENT_ID.MTO:
        assignedToDepartmentID = DEPARTMENT_ID.BFP;
        approvedByMTO1 = true;
        signatureMTO = body?.signatureMTO;
        break;
      case DEPARTMENT_ID.BFP:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        approvedByBFP = true;
        status = 1;
        signatureBFP = body?.signatureBFP;
        break;
    }
    return {
      assignedToDepartmentID,
      approvedByMTO1,
      approvedByBPLO1,
      approvedByBPLO2,
      approvedBySANIDAD,
      approvedByBFP,
      status,
      signatureMTO,
      signatureBFP,
      signatureBPLO,
    };
  }
  async #reviewByType(type, assignee, payload, body) {
    let action;
    switch (type) {
      case APPLICATION_TYPES.RENEW:
        action = this.#assigneeRenewalPermit(assignee, payload, body);

        break;
      default:
        action = this.#assigneeNewPermit(assignee, payload, body);

        break;
    }
    return action;
  }
  async #reviewSignature(files, keyName) {
    let signatureMTO, signatureBFP, signatureBPLO;
    switch (keyName) {
      case "signatureMTO":
        signatureMTO = files;
        break;
      case "signatureBFP":
        signatureBFP = files;
        break;
      case "signatureBFP":
        signatureBPLO = files;
        break;
    }
    return {
      signatureMTO,
      signatureBFP,
      signatureBPLO,
    };
  }
  async reviewPermit(id, files, keyName) {
    const { dataValues } = await this.getBusinessPermitByID(id);

    try {
      const payload = await this.#reviewSignature(files, keyName);
      console.log(
        "🚀 ~ file: controller.js:399 ~ BusinessPermitService ~ reviewPermit ~ payload:",
        payload
      );
      const reviewed = await this.#reviewByType(
        dataValues?.type,
        dataValues?.assignedToDepartmentID,
        dataValues,
        payload
      );
      console.log(
        "🚀 ~ file: controller.js:409 ~ BusinessPermitService ~ reviewPermit ~ reviewed:",
        reviewed
      );
      const result = await this.#model.update(reviewed, {
        where: { id },
        plain: true,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}
module.exports = { BusinessPermitService };
