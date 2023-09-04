const router = require("express").Router({ mergeParams: true });
const { responseCodes } = require("../common/response/code");
const mw = require("../validation/middleware");
const { UsersController } = require("../modules/users/controller");

const usersController = new UsersController();

router.post("/sign-in", mw.validateLogin, async (req, res) => {
  try {
    const { body, session } = req;
    const data = await usersController.loginUser(body);
    session.email = body.email;
    session.password = body.password;
    return res.success(200, responseCodes.LOGIN_SUCCESS, { data, session });
  } catch (e) {
    console.log("🚀 ~ file: login-route.js:16 ~ router.post ~ e:", e);
    return res.error(400, responseCodes.LOGIN_FAILED, e);
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

router.put("/sign-in/:id", async (req, res) => {
  try {
    const data = await usersController.userActivate(req.params.id);
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
  }
});
router.post("/sign-in/forgotPassword", mw.validateEmail, async (req, res) => {
  try {
    const data = await usersController.forgotPassword(req.body);
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
  }
});
module.exports = router;
