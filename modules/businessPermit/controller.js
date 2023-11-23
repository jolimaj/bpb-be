const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
const {
  BasicInfo,
  BusinessActivity,
  OtherInfo,
  BusinessPermit,
  BFPForm,
  Departments,
  Requirements,
  QueueNos,
} = require("../../db/models/index");
const {
  NotificationService,
} = require("../../common/service/notification-service");
const { PDFAttach } = require("../../common/service/pdf-attach");
const { QRCodeService } = require("../../common/service/qr-code");
const { UsersController } = require("../users/controller");

const {
  BusinessPermitMapper,
} = require("../../common/mappers/business-permit-mapper");
const {
  APPLICATION_TYPES,
  DEPARTMENT_ID,
} = require("../../common/constant/business-permit-constant");
const { NOTIF_TYPE } = require("../../common/constant/notification-constant");

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
  #notifService;
  #pdfAttach;
  #qrCodeService;

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
    this.#notifService = new NotificationService();
    this.#pdfAttach = new PDFAttach();
    this.#qrCodeService = new QRCodeService();
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
      const { mobile } = await this.#userData.getUserData(
        requirementResult?.userID
      );

      await this.#notifService.sendSMSNotification({
        ...businessPermitResult,
        mobile,
      });
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
  async renewBusinessPermit(payload, email, id) {
    try {
      const businessPermits = this.#mapper.apply(payload);
      const businessPermitResult = await this.#model.update(businessPermits, {
        where: {
          id,
        },
      });
      payload.id = businessPermitResult.dataValues.id;

      const basicInfo = this.#mapper.basicInfo(payload);
      const basicInfoResult = await this.#basicInfoModel.update(basicInfo, {
        where: {
          businessPermitID: id,
        },
      });

      const otherInfo = this.#mapper.otherInfo(payload);
      const otherInfoResult = await this.#otherInfoModel.update(otherInfo, {
        where: {
          businessPermitID: id,
        },
      });

      const businessActivity = this.#mapper.businessActivity(payload);
      const businessActivityResult =
        await this.#businessActivityModel.bulkUpdate(businessActivity, {
          raw: true,
        });

      const bfp = this.#mapper.bfpForm(payload);

      const bfpResult = await this.#bfpForm.update(bfp, {
        where: {
          businessPermitID: id,
        },
      });
      const requirementResult = await this.#requirement.update(payload, {
        where: {
          businessPermitID: id,
        },
      });
      const recs = await this.getBusinessPermitByID(id);
      const { mobile } = await this.#userData.getUserData(recs?.userID);

      await this.#notifService.sendSMSNotification({ ...recs, mobile });

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

  async validateBusinessName(businessName, type) {
    try {
      const data = await BasicInfo.findOne({
        where: {
          businessName,
        },
      });

      if (type === 1 && data) {
        return Promise.reject("Business Already Registered");
      }
      return "valid";
    } catch (error) {
      return error;
    }
  }

  async getRequirementsList(email, code) {
    try {
      const { id } = await this.#userData.getUserByID(email);
      const queries = {
        where: {
          userID: id,
        },
      };

      const businessPermitResult = await this.#model.findAll({
        queries,
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
      return businessPermitResult;
    } catch (error) {
      console.log(
        "🚀 ~ file: controller.js:168 ~ BusinessPermitService ~ getBusinessPermitByUser ~ error:",
        error
      );
      return error;
    }
  }
  async getBusinessPermitByUserForRenewal(email) {
    try {
      const { id } = await this.#userData.getUserByID(email);
      const queries = {
        where: {
          userID: id,
          createdAt: {
            [Op.lte]: moment().subtract(365, "days").toISOString(),
          },
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
      return businessPermitResult;
    } catch (error) {
      console.log(
        "🚀 ~ file: controller.js:168 ~ BusinessPermitService ~ getBusinessPermitByUser ~ error:",
        error
      );
      return error;
    }
  }
  async getRequirementsByID(businessPermitID) {
    try {
      const queries = {
        where: {
          businessPermitID,
        },
      };

      const businessPermitResult = await Requirements.findOne({
        ...queries,
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
      const renewalQuery = query?.searhQuery
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
      const newQuery = query?.searhQuery
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
      const queries = type === "new" ? newQuery : renewalQuery;
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
        } else {
          assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
          approvedByMTO1 = true;
        }
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
        } else {
          assignedToDepartmentID = DEPARTMENT_ID.SANIDAD;
          approvedByBPLO1 = true;
          status = 0;
        }
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
        status = 3;
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
      case 2:
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
      case "signatureBPLO":
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
    const { mobile } = await this.#userData.getUserData(dataValues?.userID);

    try {
      let payload, reviewed;
      if (files) {
        payload = await this.#reviewSignature(files, keyName);
        reviewed = await this.#reviewByType(
          dataValues?.type,
          dataValues?.assignedToDepartmentID,
          dataValues,
          payload
        );
      } else {
        reviewed = await this.#reviewByType(
          dataValues?.type,
          dataValues?.assignedToDepartmentID,
          dataValues
        );
      }

      await this.#model.update(reviewed, {
        where: { id },
        plain: true,
      });
      const records = await this.#model.findOne({ where: { id } });

      await this.#notifService.sendSMSNotification({
        ...records.dataValues,
        mobile,
      });
      return records;
    } catch (error) {
      return error;
    }
  }
  #handleCreateQNDate() {
    const date = new Date(new Date().getTime() + 120 * 60 * 60 * 1000);
    const day = date.getDay();
    if (day === 6 || day === 7) {
      return new Date(new Date(date).getTime() + 48 * 60 * 60 * 1000);
    }
    return date;
  }
  async #addQN(payload) {
    try {
      const result = await QueueNos.create(payload, { raw: true, plain: true });
      return result;
    } catch (error) {
      return error;
    }
  }
  async releasePermit(id) {
    try {
      const { dataValues } = await this.#model.findOne({ where: { id } });
      const { businessName } = await this.#basicInfoModel.findOne({
        where: { businessPermitID: id },
        raw: true,
      });
      const { businessAddress } = await this.#otherInfoModel.findOne({
        where: { businessPermitID: id },
        raw: true,
      });

      const userData = await this.#userData.getUserData(dataValues?.userID);
      const qrCodeData = await this.#qrCodeService.generate({
        id: userData.id,
        firstName: userData?.firstName,
        middleName: userData?.middleName,
        lastName: userData?.lastName,
        businessName,
        businessAddress,
      });
      const scheduleDate = this.#handleCreateQNDate();

      await this.#addQN({
        scheduleDate: new Date(scheduleDate),
        userID: userData.id,
      });

      const pdfAttchment = await this.#pdfAttach.createPDF({
        ...userData,
        approvedDate: new Date().toLocaleDateString("en-GB"),
        businessName,
        businessAddress,
      });
      const queeNo = await QueueNos.findOne({
        where: { userID: userData.id },
        raw: true,
      });
      console.log(
        "🚀 ~ file: controller.js:699 ~ BusinessPermitService ~ releasePermit ~ queeNo:",
        queeNo
      );

      await this.#model.update(
        {
          isRelease: true,
          certificate: pdfAttchment,
          qrCode: qrCodeData,
          queueNo: queeNo.id,
        },
        {
          where: { id },
          plain: true,
        }
      );
      const res = await this.#model.findOne({ where: { id }, raw: true });

      if (res.status === 1 || res.status === 3) {
        await this.#notifService.sendEmailNotification(
          {
            ...dataValues,
            email: userData?.email,
            businessName,
            certificate: pdfAttchment,
            qrCode: qrCodeData,
            queueNo: queeNo.id,
            scheduleDate,
          },
          NOTIF_TYPE.RELEASE_PERMIT
        );
      }
      return dataValues;
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
      const { mobile } = await this.#userData.getUserData(dataValues?.userID);

      await this.#notifService.sendSMSNotification({
        ...dataValues,
        mobile,
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
