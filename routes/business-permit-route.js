const router = require("express").Router({ mergeParams: true });
const Multer = require("multer");
const { responseCodes, responseMessage } = require("../common/response/code");
const mw = require("../validation/middleware");
const {
  BusinessPermitService,
} = require("../modules/businessPermit/controller");
const { UsersController } = require("../modules/users/controller");
const { UploaderService } = require("../common/service/uploader");
const { DepartmentsModule } = require("../modules/departments/controller");
const {
  RequirementsController,
} = require("../modules/requirements/controller");

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

const businessPermit = new BusinessPermitService();
const uploaderService = new UploaderService();
const departmentController = new DepartmentsModule();
const usersController = new UsersController();
const requirementsController = new RequirementsController();

router.put(
  "/services/requirements/:id",
  upload.any("requirements"),
  async (req, res) => {
    try {
      const { params, files, session } = req;

      if (session?.email && session?.password) {
        const imageUrlList = [];
        const keyName = [];

        for (const item in files) {
          const body = await uploaderService.uploadFiles(
            files[item],
            "requirements"
          );
          imageUrlList.push(body);
          keyName.push(files[item].fieldname);
        }

        const data = await requirementsController.submitRequirements(
          imageUrlList,
          keyName,
          params.id
        );
        if (imageUrlList.length > 0)
          return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
    }
  }
);

router.get("/services/requirements", async (req, res) => {
  try {
    const { session } = req;

    if (session?.email && session?.password) {
      const data =
        await requirementsController.getRequirementsByBusinessPermitID(
          session?.email
        );
      return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
    }
    return res.error(
      400,
      responseCodes.LOGIN_FIRST,
      responseMessage.LOGIN_FIRST
    );
  } catch (e) {
    console.log("🚀 ~ file: business-permit-route.js:39 ~ e:", e);
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});

router.post(
  "/services/businessPermit/validateBasicInfo",
  mw.validateBasicInfo,
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        const data = await businessPermit.validateBusinessName(
          body.businessName
        );
        return res.success(200, responseCodes.VALIDATION_BASIC_INFO, data);
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/businessPermit/validateBusinessActivity",
  mw.validateBusinessActivity,
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        return res.success(
          200,
          responseCodes.VALIDATION_BUSINESS_ACTIVITY,
          "valid"
        );
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/businessPermit/validateBusinessActivity",
  mw.validateBusinessActivity,
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        return res.success(
          200,
          responseCodes.VALIDATION_BUSINESS_ACTIVITY,
          "valid"
        );
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/businessPermit/validateOtherInfo",
  mw.validateOtherInfo,
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        return res.success(200, responseCodes.VALIDATION_OTHER_INFO, "valid");
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/businessPermit/validateBFPForm",
  mw.validateBFPForm,
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        return res.success(200, responseCodes.VALIDATION_BFP_FORM, "valid");
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/businessPermit",
  upload.single("applicantSignature"),
  async (req, res) => {
    try {
      const { body, file, session } = req;

      if (session?.email && session?.password) {
        body.applicantSignature = await uploaderService.uploadFiles(
          file,
          "applicantSignature"
        );
        const data = await businessPermit.applyBusinessPermit(
          body,
          session?.email
        );
        return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.get("/services/businessPermit", async (req, res) => {
  try {
    const { session } = req;

    if (session?.email && session?.password) {
      const data = await businessPermit.getBusinessPermitByUser(session?.email);
      return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
    }
    return res.error(
      400,
      responseCodes.LOGIN_FIRST,
      responseMessage.LOGIN_FIRST
    );
  } catch (e) {
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});

router.put(
  "/:id/:notifParamsId",
  mw.validatePassword,
  mw.validateStaffID,
  async (req, res) => {
    try {
      const { body, params } = req;
      const data = await usersController.addPassword(
        params.id,
        params.notifParamsId,
        body.password
      );
      return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);
router.get("/departments", async (req, res) => {
  const { query, session } = req;

  if (session?.email && session?.password) {
    const data = await departmentController.getDepartments(query);

    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});
// router.get("/departments", async (req, res) => {
//   const { query, session } = req;

//   const data = await departmentController.getDepartments(query);

//   if (session?.email && session?.password) {
//     return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
//   }

//   return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
// });
router.get("/departments/businessPermit/new", async (req, res) => {
  const { query, session } = req;

  if (session?.email && session?.password) {
    const data = await businessPermit.getBusinessPermits(
      query,

      session?.email,
      "new"
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});
router.get("/departments/businessPermit/renew", async (req, res) => {
  const { query, session } = req;

  if (session?.email && session?.password) {
    const data = await businessPermit.getBusinessPermits(
      query,

      session?.email,
      "renew"
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.put(
  "/departments/businessPermit/:id",
  mw.validateApprover,
  upload.any("file"),
  async (req, res) => {
    try {
      const { params, body, files, session } = req;

      if (session?.email && session?.password) {
        let data;
        if (body?.result === "approve") {
          const request = await uploaderService.uploadFiles(
            files[0],
            files[0].fieldname
          );
          data = await businessPermit.reviewPermit(
            params.id,
            request,
            files[0].fieldname
          );
        }
        data = await businessPermit.disapproveRequest(params.id, body);
        return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
      }

      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
    }
  }
);

router.put("/departments/profile", async (req, res) => {
  try {
    const { session, body } = req;
    if (session?.email && session?.password) {
      const data = await usersController.updateUserData(
        session?.email,
        body.mobile
      );
      return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
    }

    return res.error(
      400,
      responseCodes.LOGIN_FIRST,
      responseMessage.LOGIN_FIRST
    );
  } catch (e) {
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { session, body } = req;
    if (session?.email && session?.password) {
      const data = await usersController.updateUserData(
        session?.email,
        body.mobile
      );
      return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
    }

    return res.error(
      400,
      responseCodes.LOGIN_FIRST,
      responseMessage.LOGIN_FIRST
    );
  } catch (e) {
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});
module.exports = router;
