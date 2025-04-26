const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
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

router.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter valid email")
      .normalizeEmail(),
    body("password", "Pasword is required").notEmpty().trim(),
  ],
  postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("User with email already exist");
        }
        return true;
      })
      .normalizeEmail(),
    body("first_name")
      .notEmpty()
      .withMessage("First name is required.")
      .isAlpha()
      .withMessage("First name, Only alphabet is allowed")
      .trim(),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required.")
      .isAlpha()
      .withMessage("Last name, Only alphabet is allowed")
      .trim(),
    body(
      "password",
      "Please enter a password with number and text only and atlease 6 character"
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm Password should match");
      }
      return true;
    }),
  ],
  postSignup
);

router.post("/logout", postLogout);

router.get("/reset-password", getResetPassword);

router.post("/reset-password", postResetPassword);

router.get("/reset-password/:token", getUpdatePassword);

router.post("/update-password", postUpdatePassword);

router.get("/change-password", getChangePassword);

router.post("/change-password", postChangePassword);

module.exports = router;
