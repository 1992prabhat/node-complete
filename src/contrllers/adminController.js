const { mongoose } = require("mongoose");
const product = require("../models/product");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../../utils/file");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    product: {
      title: "",
      price: "",
      description: "",
    },
    editing: false,
    hasError: false,
    validationErrors: [],
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      editing: false,
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
    });
  }
  const { title, description, price } = req.body;
  const image = req.file;
  if (!image) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      editing: false,
      validationErrors: errors.array(),
      errorMessage: "Attached file is not an Image.",
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("Product created");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findOne({ _id: prodId, userId: req.user._id })
    .then((product) => {
      if (product) {
        return res.render("admin/edit-product", {
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product,
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { title, description, price, id } = req.body;
  const image = req.file;
  Product.findOne({ _id: id, userId: req.user._id }).then((product) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        validationErrors: errors.array(),
        errorMessage: errors.array()[0].msg,
        product: product,
      });
    }
  });

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() != req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("Product Updated");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: id, userId: req.user._id });
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "All Prodcuts",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
