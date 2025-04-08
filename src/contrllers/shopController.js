const Product = require("../models/product");
const Order = require("../models/order");
const product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      res.render("shop/product-detail", {
        docTitle: "Product Details",
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;
    const cartTotal = user.cart.cartTotal;
    res.render("shop/cart", {
      docTitle: "Your Cart",
      path: "/cart",
      formCss: false,
      productCss: false,
      activeAddProduct: true,
      products: products,
      cartTotal: cartTotal,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
};

exports.postOrder = (req, res, next) => {
  let orderTotal = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        const product = { ...item.productId._doc };
        orderTotal = orderTotal + product.price * item.quantity;
        return { quantity: item.quantity, product: product };
      });
      const order = new Order({
        user: {
          name: req.user.first_name + " " + req.user.last_name,
          userId: req.user._id,
        },
        products: products,
        orderTotal: orderTotal,
      });

      order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders.products);
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "My Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
