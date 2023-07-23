const router = require("express").Router({ mergeParams: true });
const Users = require("./users-route");
const Login = require("./login-route");

router.use("/users", Users);
router.use("/", Login);

module.exports = router;
