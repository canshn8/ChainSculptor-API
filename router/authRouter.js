const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/auth/signup", authController.signup);
router.post("/auth/signin", authController.signin);

module.exports = router;