const router = require("express").Router({ mergeParams: true });
const { responseCodes } = require("../common/response/code");
const mw = require("../validation/middleware");
const { GenericModule } = require("../modules/generic/controller");

const generic = new GenericModule();

router.get("/businessType", async (req, res) => {
  try {
    const { query } = req;
    const data = await generic.getBusinessType(query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  } catch (e) {
    return res.error(400, responseCodes.EMPTY_RECORD_LIST, e);
  }
});

router.get("/paymentType", async (req, res) => {
  try {
    const { query } = req;
    const data = await generic.getPaymentType(query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  } catch (e) {
    return res.error(400, responseCodes.EMPTY_RECORD_LIST, e);
  }
});

router.get("/departmentCodes", async (req, res) => {
  try {
    const { query } = req;
    const data = await generic.getDepartments(query);
    return res.success(200, responseCodes.RETRIEVE_RECORD_LIST, data);
  } catch (e) {
    return res.error(400, responseCodes.EMPTY_RECORD_LIST, e);
  }
});
module.exports = router;
