const router = require("express").Router({ mergeParams: true });
const { responseCodes } = require("../common/response/code");
const { UsersController } = require("../modules/users/controller");

const usersController = new UsersController();

router.get("/users", async (req, res) => {
  try {
    const data = await usersController.getAll(req.query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  } catch (e) {
    return res.error(400, responseCodes.EMPTY_RECORD_LIST, e);
  }
});

router.post("/users", async (req, res) => {
  try {
    const data = await usersController.registrationUser(req.body);
    return res.success(200, responseCodes.CREATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.CREATE_RECORD_FAILED, e);
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const data = await usersController.userActivate(req.params.id);
    return res.success(200, responseCodes.UPDATE_RECORD_SUCCESS, data);
  } catch (e) {
    return res.error(400, responseCodes.UPDATE_RECORD_FAILED, e);
  }
});
module.exports = router;
