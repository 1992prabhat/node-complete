const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const adminRoutes = require("./src/routes/admin");
const shopRoutes = require("./src/routes/shop");
const authRoutes = require("./src/routes/auth");
const { notFound } = require("./src/contrllers/error");
const User = require("./src/models/user");

const MONGO_URI = "mongodb://localhost:27017/shop";
const app = express();
const csrfProtection = csrf();

const store = new MongoDbStore({
  uri: MONGO_URI,
  collection: "session",
});
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(notFound);

mongoose
  .connect(MONGO_URI)
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
