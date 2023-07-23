const router = require("express").Router({ mergeParams: true });
const Users = require("./users-route");

router.use("/", Users);

module.exports = router;
