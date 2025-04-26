const express = require("express");
const isAuth = require("../middlewares/is-auth");
const { check, body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../contrllers/adminController");

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").notEmpty().withMessage("Price is required").isFloat(),
    // body("imageUrl").isURL(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

router.get("/products", isAuth, getAdminProducts);

module.exports = router;
