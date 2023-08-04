const router = require("express").Router({ mergeParams: true });
const Login = require("./login-route");
const Admin = require("./admin-route");

router.use("/admin", Admin);
router.use("/", Login);

module.exports = router;
