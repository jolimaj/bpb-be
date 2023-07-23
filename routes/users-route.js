const router = require("express").Router({ mergeParams: true });
const { responseCodes } = require("../common/response/code");
const { UsersController } = require("../modules/users/controller");

const usersController = new UsersController();

router.get("/", async (req, res) => {
  try {
    const data = await usersController.getAll(req.query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  } catch (e) {
    return res.error(400, responseCodes.EMPTY_RECORD_LIST, e);
  }
});

module.exports = router;
