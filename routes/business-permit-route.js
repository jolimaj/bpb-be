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

      const imageUrlList = [];
      const keyName = [];

      for (const item in files) {
        const body = await uploaderService.uploadFiles(
          files[item],
          `requirements/${files[item].fieldname}`
        );
        imageUrlList.push(body);
        keyName.push(files[item].fieldname);
      }
      const data = await requirementsController.submitRequirements(
        imageUrlList,
        keyName,
        params.id
      );
      console.log("🚀 ~ file: business-permit-route.js:51 ~ data:", data);
      if (imageUrlList.length > 0)
        return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
    } catch (e) {
      console.log("🚀 ~ file: business-permit-route.js:53 ~ e:", e);
      return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
    }
  }
);

router.post(
  "/services/requirements",
  upload.any("requirements"),
  async (req, res) => {
    try {
      const { params, body, files, session } = req;

      const imageUrlList = [];
      const keyName = [];

      for (const item in files) {
        const bodys = await uploaderService.uploadFiles(
          files[item],
          `requirements/${files[item].fieldname}`
        );
        imageUrlList.push(bodys);
        keyName.push(files[item].fieldname);
      }
      const data = await requirementsController.submitRequirements(
        imageUrlList,
        keyName,
        params.id,
        body
      );
      console.log("🚀 ~ file: business-permit-route.js:51 ~ data:", data);
      if (imageUrlList.length > 0)
        return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
    } catch (e) {
      console.log("🚀 ~ file: business-permit-route.js:53 ~ e:", e);
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
          body.businessName,
          body.type
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
  upload.any("file"),
  async (req, res) => {
    try {
      const { body, files, session } = req;
      console.log("🚀 ~ file: business-permit-route.js:238 ~ body:", body);
      if (session?.email && session?.password) {
        const filesList = await uploaderService.uploadFiles(files);
        if (filesList.length > 0) {
          filesList.forEach((element) => {
            body[element.folder] = element.secure_url;
          });
        }
        console.log(
          "🚀 ~ file: business-permit-route.js:243 ~ filesList.forEach ~ body:",
          body
        );

        const data = await businessPermit.applyBusinessPermit(
          body,
          session?.email
        );
        console.log("🚀 ~ file: business-permit-route.js:254 ~ data:", data);
        return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      console.log("🚀 ~ file: business-permit-route.js:257 ~ e:", e);
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.put(
  "/services/businessPermit/:id",
  upload.any("file"),
  async (req, res) => {
    try {
      const { body, file, session, params } = req;

      if (session?.email && session?.password) {
        body.applicantSignature = await uploaderService.uploadFiles(
          file,
          "applicantSignature"
        );
        const data = await businessPermit.renewBusinessPermit(
          body,
          session?.email,
          params?.id
        );
        return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
      }
      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      console.log("🚀 ~ file: business-permit-route.js:286 ~ e:", e);
      return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
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

router.get("/services/businessPermit/renew", async (req, res) => {
  try {
    const { session } = req;
    if (session?.email && session?.password) {
      const data = await businessPermit.getBusinessPermitByUserForRenewal(
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
});
router.get("/services/businessPermit/requirements/:id", async (req, res) => {
  try {
    const { session, params } = req;
    if (session?.email && session?.password) {
      const data = await businessPermit.getRequirementsByID(params?.id);
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

router.get("/services/requirements", async (req, res) => {
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
      console.log(
        "🚀 ~ file: business-permit-route.js:439 ~ session:",
        session
      );
      if (session?.email && session?.password) {
        let data;
        if (body?.release) {
          data = await businessPermit.releasePermit(params.id);
        } else {
          if (body?.result === "approve") {
            let request;
            if (files) {
              request = await uploaderService.uploadFiles(
                files[0],
                files[0]?.fieldname
              );
              data = await businessPermit.reviewPermit(
                params.id,
                request,
                files[0]?.fieldname
              );
            } else {
              data = await businessPermit.reviewPermit(params.id);
            }
          } else {
            data = await businessPermit.disapproveRequest(params.id, body);
          }
        }
        return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
      }

      return res.error(
        400,
        responseCodes.LOGIN_FIRST,
        responseMessage.LOGIN_FIRST
      );
    } catch (e) {
      console.log("🚀 ~ file: business-permit-route.js:449 ~ e:", e);
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

router.get("/departments/profile", async (req, res) => {
  const { session } = req;
  if (session?.email && session?.password) {
    const data = await usersController.getUserByID(session?.email);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.get("/profile", async (req, res) => {
  const { session } = req;
  console.log(
    "🚀 ~ file: business-permit-route.js:420 ~ router.get ~ session:",
    session
  );
  if (session?.email && session?.password) {
    const data = await usersController.getUserByID(session?.email);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

module.exports = router;
