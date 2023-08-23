const router = require("express").Router({ mergeParams: true });

const { responseCodes, responseMessage } = require("../common/response/code");
const mw = require("../validation/middleware");

const { UsersController } = require("../modules/users/controller");
const { DepartmentsModule } = require("../modules/departments/controller");
const {
  NotificationService,
} = require("../common/service/notification-service");

const usersController = new UsersController();
const departmentsController = new DepartmentsModule();

router.post("/approvers", mw.validateStaff, async (req, res) => {
  try {
    if (req.session?.email && req.session?.password) {
      const data = await usersController.addStaff(req.body);
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

router.get("/users", async (req, res) => {
  const { query, session } = req;

  const data = await usersController.getAll(query);

  if (session?.email && session?.password) {
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
  const { query, session } = req;

  const data = await departmentsController.getDepartments(query);

  if (session?.email && session?.password) {
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  }

  return res.error(400, responseCodes.LOGIN_FIRST, responseMessage.LOGIN_FIRST);
});

module.exports = router;
