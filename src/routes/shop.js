const express = require("express");
const {
  getIndex,
  getProducts,
  getCart,
  postCart,
  getCheckout,
  getOrders,
  getProductDetails,
  postCartDelete,
  postOrder,
} = require("../contrllers/shopController");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:id", getProductDetails);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postCartDelete);

router.get("/checkout", getCheckout);

router.post("/create-order", postOrder);

router.get("/orders", getOrders);

module.exports = router;
