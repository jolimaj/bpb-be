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
const businesspermit = require("../db/models/businesspermit");

const usersController = new UsersController();
const departmentsController = new DepartmentsModule();
const businessPermitController = new BusinessPermitService();

router.post("/staff", mw.validateStaff, async (req, res) => {
  console.log("🚀 ~ file: admin-route.js:16 ~ router.post ~ req:", req);
  try {
    const { body, sessionStore } = req;
    const session = sessionStore.sessions;
    if (Object.keys(session).length > 0) {
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

router.get("/staff", async (req, res) => {
  const { query, sessionStore } = req;
  const session = sessionStore.sessions;
  if (Object.keys(session).length > 0) {
    const data = await usersController.getAllStaff(
      query,
      JSON.parse(session[Object.keys(session)])?.email
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.get("/users", async (req, res) => {
  const { query, session } = req;

  if (session?.email && session?.password) {
    const data = await usersController.getAll(query, session?.email);
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
  const { query, sessionStore } = req;
  const session = sessionStore.sessions;

  if (Object.keys(session).length > 0) {
    const data = await departmentsController.getDepartments(
      query,
      session?.email
    );
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

router.get("/dashboard", async (req, res) => {
  const { query, sessionStore } = req;
  const session = sessionStore.sessions;
  if (Object.keys(session).length > 0) {
    const data = await businessPermitController.countData(query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});
module.exports = router;
