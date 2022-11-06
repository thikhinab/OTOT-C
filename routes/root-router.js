const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller.js");

router.route("/register").post(controller.registerUser);
router.route("/login").post(controller.handleLogin);
router.route("/logout").get(controller.handleLogout);
router.route("/refresh").get(controller.refreshToken);

module.exports = router;
