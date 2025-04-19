const express = require("express");

const router = express.Router();

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getUpdatePassword,
  postUpdatePassword,
  getChangePassword,
  postChangePassword,
} = require("../contrllers/authController");

router.get("/login", getLogin);

router.get("/signup", getSignup);

router.post("/login", postLogin);

router.post("/signup", postSignup);

router.post("/logout", postLogout);

router.get("/reset-password", getResetPassword);

router.post("/reset-password", postResetPassword);

router.get("/reset-password/:token", getUpdatePassword);

router.post("/update-password", postUpdatePassword);

router.get("/change-password", getChangePassword);

router.post("/change-password", postChangePassword);

module.exports = router;
