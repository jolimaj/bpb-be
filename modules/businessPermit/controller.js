const { Op, Sequelize } = require("sequelize");
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
  #mapper;
  #basicInfoModel;
  #otherInfoModel;
  #businessActivityModel;
  #bfpForm;
  #userData;
  #requirement;
  #departments;

  constructor() {
    this.#mapper = new BusinessPermitMapper();
    this.#model = BusinessPermit;
    this.#basicInfoModel = BasicInfo;
    this.#otherInfoModel = OtherInfo;
    this.#businessActivityModel = BusinessActivity;
    this.#bfpForm = BFPForm;
    this.#userData = new UsersController();
    this.#requirement = Requirements;
    this.#departments = Departments;
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
  async getBusinessPermitByUser(email) {
    try {
      const { id } = await this.#userData.getUserByID(email);
      const queries = {
        where: {
          userID: id,
        },
      };

      const businessPermitResult = await this.#model.findAll({
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
      console.log(businessPermitResult);
      return businessPermitResult;
    } catch (error) {
      console.log(
        "🚀 ~ file: controller.js:168 ~ BusinessPermitService ~ getBusinessPermitByUser ~ error:",
        error
      );
      return error;
    }
  }
  async getBusinessPermits(query, email, types) {
    try {
      const type =
        types === "new" ? APPLICATION_TYPES.NEW : APPLICATION_TYPES.RENEW;
      const { departmentID } = await this.#userData.getUserByID(email);

      const queries = query?.searhQuery
        ? {
            where: {
              assignedToDepartmentID: departmentID,
              [Op.or]: [
                { id: query?.searhQuery },
                { lastName: query?.searhQuery },
              ],
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
      const departmentData = await this.#departments.findAll({
        where: {
          id: departmentID,
        },
        raw: true,
      });

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

      return { results, departmentData };
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
  #rejectNewPermit(payload) {
    let assignedToDepartmentID,
      status = 0;
    switch (payload?.assignedToDepartmentID) {
      case DEPARTMENT_ID.MPDC:
        assignedToDepartmentID = DEPARTMENT_ID.MTO;
        break;
      case DEPARTMENT_ID.MTO:
        if (payload?.approvedByMTO1) {
          assignedToDepartmentID = DEPARTMENT_ID.MENRO;
        }
        assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
        break;
      case DEPARTMENT_ID.SANIDAD:
        assignedToDepartmentID = DEPARTMENT_ID.MEO;
        break;
      case DEPARTMENT_ID.MEO:
        assignedToDepartmentID = DEPARTMENT_ID.MTO;
        break;
      case DEPARTMENT_ID.MENRO:
        assignedToDepartmentID = DEPARTMENT_ID.BFP;
        break;
      case DEPARTMENT_ID.BFP:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        signatureBFP = body?.signatureBFP;
        break;
      case DEPARTMENT_ID.BPLO:
        status = -1;
        break;
    }
    console.log(assignedToDepartmentID);
    return { assignedToDepartmentID, status };
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
  #rejectRenewalPermit(payload) {
    let assignedToDepartmentID,
      status = 0;
    switch (payload?.assignedToDepartmentID) {
      case DEPARTMENT_ID.BPLO:
        if (payload.approvedByBPLO1) {
          assignedToDepartmentID = DEPARTMENT_ID.MTO;
        }
        assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
        break;
      case DEPARTMENT_ID.SANIDAD:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        break;
      case DEPARTMENT_ID.MTO:
        assignedToDepartmentID = DEPARTMENT_ID.BFP;
        break;
      case DEPARTMENT_ID.BFP:
        assignedToDepartmentID = DEPARTMENT_ID.BPLO;
        status = -1;
        break;
    }
    return {
      assignedToDepartmentID,
      status,
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
      const reviewed = await this.#reviewByType(
        dataValues?.type,
        dataValues?.assignedToDepartmentID,
        dataValues,
        payload
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

  async disapproveRequest(id, payload) {
    try {
      delete payload?.result;
      // remarks add to sms
      const { dataValues } = await this.getBusinessPermitByID(id);
      const requestData =
        dataValues?.type === 1
          ? this.#rejectNewPermit(dataValues)
          : this.#rejectRenewalPermit(dataValues);

      const result = await this.#model.update(requestData, {
        where: { id },
        plain: true,
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async countData(query) {
    try {
      const TODAY_START = new Date().setHours(0, 0, 0, 0);
      const NOW = new Date();
      const dailynewApplication = await this.#model.count({
        where: {
          type: 1,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const monthlyNew = await this.#model.count({
        attributes: [
          [
            Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")),
            "month",
          ],
          [Sequelize.fn("COUNT", "id"), "totalCount"],
        ],
        where: { type: 1 },
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        ],
      });
      const monthlyReNew = await this.#model.count({
        attributes: [
          [
            Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")),
            "month",
          ],
          [Sequelize.fn("COUNT", "id"), "totalCount"],
        ],
        where: { type: 2 },
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        ],
      });
      const dailyrenewalApplication = await this.#model.count({
        where: {
          type: 2,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });
      return {
        dailynewApplication,
        monthlyNew,
        dailyrenewalApplication,
        monthlyReNew,
      };
    } catch (error) {
      return error;
    }
  }
}
module.exports = { BusinessPermitService };
