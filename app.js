const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const adminRoutes = require("./src/routes/admin");
const shopRoutes = require("./src/routes/shop");
const { notFound } = require("./src/contrllers/error");
const User = require("./src/models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("67f2ae90ee1e05d078ce28f0")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFound);

mongoose
  .connect("mongodb://localhost:27017/shop")
  .then((result) => {
    // const user = new User({
    //   username: "Prabhat92",
    //   email: "prabhat894@gmail.com",
    //   password: "123456",
    //   first_name: "Prabhat",
    //   last_name: "Burnwal",
    //   cart: {
    //     items: [],
    //   },
    // });
    // user.save();
    app.listen(3000);
  })
  .catch((err) => {});
