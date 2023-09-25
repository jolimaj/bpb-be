const router = require("express").Router({ mergeParams: true });

const { responseCodes, responseMessage } = require("../common/response/code");
const mw = require("../validation/middleware");

const { UsersController } = require("../modules/users/controller");
const { DepartmentsModule } = require("../modules/departments/controller");
const {
  BusinessPermitService,
} = require("../modules/businessPermit/controller");
const {
  NotificationService,
} = require("../common/service/notification-service");

const usersController = new UsersController();
const departmentsController = new DepartmentsModule();
const businessPermitController = new BusinessPermitService();

router.post("/staff", mw.validateStaff, async (req, res) => {
  try {
    const { body, sessionStore, session } = req;
    const sessionKey = sessionStore?.sessions ?? session;

    if (Object.keys(sessionKey).length > 0) {
      const data = await usersController.addStaff(body);
      return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
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
router.post("/staff/reinvite", async (req, res) => {
  try {
    const { body, sessionStore, session } = req;
    const sessionKey = sessionStore?.sessions ?? session;

    if (Object.keys(sessionKey).length > 0) {
      const data = await usersController.reinviteStaff(body.id);
      return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
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

router.get("/staff", async (req, res) => {
  const { query, sessionStore, session } = req;
  const sessionKey = sessionStore?.sessions ?? session;
  if (Object.keys(sessionKey).length > 0) {
    const data = await usersController.getAllStaff(
      query,
      sessionKey?.email ??
        JSON.parse(sessionKey[Object.keys(sessionKey)])?.email
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.get("/users", async (req, res) => {
  const { query, sessionStore, session } = req;

  const sessionKey = sessionStore?.sessions ?? session;
  if (Object.keys(sessionKey).length > 0) {
    const data = await usersController.getAll(
      query,
      sessionKey?.email ??
        JSON.parse(sessionKey[Object.keys(sessionKey)])?.email
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.post(
  "/users/upload",
  // upload.single("files"),
  async (req, res) => {
    try {
      const notificationService = new NotificationService();
      const cldRes = await notificationService.sendSMSNotification(req.body);
      return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, cldRes);
    } catch (error) {
      console.log("🚀 ~ file: admin-route.js:45 ~ error:", error);
    }
    // try {
    //   const uploaderService = new UploaderService();

    //   const cldRes = await uploaderService.uploadFiles(req.file, "samplse");
    //   return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, cldRes);
    // } catch (e) {
    //   return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
    // }
  }
);

router.get("/departments", async (req, res) => {
  const { query, sessionStore, session } = req;
  const sessionKey = sessionStore?.sessions ?? session;

  if (Object.keys(sessionKey).length > 0) {
    const data = await departmentsController.getDepartments(
      query,
      sessionKey?.email ??
        JSON.parse(sessionKey[Object.keys(sessionKey)])?.email
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.put("/departments/:departmentID", async (req, res) => {
  const { body, params, sessionStore, session } = req;
  const sessionKey = sessionStore?.sessions ?? session;

  if (Object.keys(sessionKey).length > 0) {
    const data = await usersController.updateDepartments({
      departmentID: params.departmentID,
      id: body.userID,
    });
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.get("/dashboard", async (req, res) => {
  const { query, sessionStore, session } = req;

  const sessionKey = sessionStore?.sessions ?? session;
  if (Object.keys(sessionKey).length > 0) {
    const data = await businessPermitController.countData(query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});
module.exports = router;
