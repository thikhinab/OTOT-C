const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");
const verifyJwt = require("../middleware/verify-jwt");
const verifyRoles = require("../middleware/verify-roles");
const ROLE_LIST = require("../config/roles-list");

router.route("/register").post(controller.registerUser);
router.route("/login").post(controller.handleLogin);
router.route("/logout").get(controller.handleLogout);
router.route("/refresh").get(controller.refreshToken);

router.route("/authn", verifyJwt);
router.route("/authn/admin", verifyRoles(ROLE_LIST.Admin));
router.route(
    "/authn/moderator",
    verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Moderator)
);
router.route("/authn/user", verifyRoles(ROLE_LIST.Admin, ROLE_LIST.User));

module.exports = router;
