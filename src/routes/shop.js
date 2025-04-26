const express = require("express");
const isAuth = require("../middlewares/is-auth");

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
  getInvoice,
} = require("../contrllers/shopController");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:id", getProductDetails);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDelete);

router.get("/checkout", isAuth, getCheckout);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
