const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");
const verifyJwt = require("../middleware/verify-jwt");
const verifyRoles = require("../middleware/verify-roles");
const ROLE_LIST = require("../config/roles-list");

router.use(verifyJwt);
router.route("/admin").get(verifyRoles(ROLE_LIST.Admin), controller.get);
router
    .route("/oderator")
    .get(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Moderator), controller.get);
router
    .route("/user")
    .get(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.User), controller.get);

module.exports = router;
