const express = require("express");
const isAuth = require("../middlewares/is-auth");

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

router.post("/add-product", isAuth, postAddProduct);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product", isAuth, postDeleteProduct);

router.get("/products", isAuth, getAdminProducts);

module.exports = router;
