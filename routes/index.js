const router = require("express").Router({ mergeParams: true });
const Login = require("./login-route");
const Admin = require("./admin-route");
const Account = require("./business-permit-route");

router.use("/account", Account);
router.use("/admin", Admin);
router.use("/", Login);

module.exports = router;
