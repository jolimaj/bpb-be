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
  "/service/requirements/:id",
  upload.any("requirements"),
  async (req, res) => {
    try {
      const { params, session, files } = req;
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

router.get("/service/requirements", async (req, res) => {
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
  "/service/apply",
  upload.single("applicantSignature"),
  mw.validateSignature,
  mw.validatePermit,
  async (req, res) => {
    try {
      const { body, session, file } = req;
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
      console.log("🚀 ~ file: business-permit-route.js:39 ~ e:", e);
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);

router.get("/service/apply/:userID/:id", async (req, res) => {
  try {
    const { params, session } = req;
    if (session?.email && session?.password) {
      const data = await businessPermit.getBusinessPermitByUser(
        params?.userID,
        params?.id
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

router.put(
  "/:id",
  mw.validatePassword,
  mw.validateStaffID,
  async (req, res) => {
    try {
      const { body, params } = req;
      const data = await usersController.addPassword(params.id, body.password);
      return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
    } catch (e) {
      return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    }
  }
);
router.get("/departments", async (req, res) => {
  const { query, session } = req;

  const data = await departmentController.getDepartments(query);

  if (session?.email && session?.password) {
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
router.get("/departments/businessPermits/new", async (req, res) => {
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
router.get("/departments/businessPermits/renew", async (req, res) => {
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

router.put("/departments/businessPermits/:id", async (req, res) => {
  try {
    const { params, body, session } = req;

    if (session?.email && session?.password) {
      const data = await businessPermit.reviewPermit(params.id, body);
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
});

module.exports = router;
