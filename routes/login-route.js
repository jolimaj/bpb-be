const router = require("express").Router({ mergeParams: true });
const { responseCodes } = require("../common/response/code");
const mw = require("../validation/middleware");
const { UsersController } = require("../modules/users/controller");

const usersController = new UsersController();
const { NotificationController } = require("../modules/notifcation/controller");

const notifParamsController = new NotificationController();

router.get("/notifParams/:uuid", async (req, res) => {
  try {
    const { params } = req;
    const data = await notifParamsController.getQueryParams(params?.uuid);
    return res.success(200, responseCodes.NOTIF_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.NOTIF_FAILED, e);
  }
});

router.post("/sign-in", mw.validateLogin, async (req, res) => {
  try {
    const { body } = req;
    const data = await usersController.loginUser(body);
    req.session.email = body.email;
    req.session.password = body.password;
    req.session.save();
    return res.success(200, responseCodes.LOGIN_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.LOGIN_FAILED, e);
  }
});

router.post("/sign-out", async (req, res) => {
  try {
    req.session.destroy();
    delete req.session;

    const data = await usersController.logoutUser();
    return res.success(200, responseCodes.LOGOUT_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.LOGOUT_FAILED, e);
  }
});

router.post("/sign-up", mw.validateRegister, async (req, res) => {
  try {
    const data = await usersController.registrationUser(req.body);
    return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});

router.put("/sign-in/activate/:id", async (req, res) => {
  try {
    const { id, notifParamsId } = req.params;
    const data = await usersController.userActivate(id, notifParamsId);
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
  }
});
router.put("/sign-in/forgotPassword", mw.validateEmail, async (req, res) => {
  try {
    const data = await usersController.forgotPassword(req.body);
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
  }
});
router.patch(
  "/sign-in/forgotPassword/:id",
  mw.validatePassword,
  async (req, res) => {
    try {
      const data = await usersController.addPassword(
        req.params.id,
        req.body.password
      );
      return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
    } catch (e) {
      return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
    }
  }
);
module.exports = router;
