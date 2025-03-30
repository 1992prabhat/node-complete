const express = require("express");
const path = require("path");

const adminRoutes = require("./src/routes/admin");
const shopRoutes = require("./src/routes/shop");
const { notFound } = require("./src/contrllers/error");

const sequelize = require("./utils/database");
const Product = require("./src/models/product");
const User = require("./src/models/user");
const Cart = require("./src/models/cart");
const CartItem = require("./src/models/cart-item");
const Order = require("./src/models/order");
const OrderItem = require("./src/models/order-item");
const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        email: "prabhat894@gmail.com",
        password: "123456",
        first_name: "Prabhat",
        last_name: "Burnwal",
      });
    }
    return user;
  })
  .then(async (user) => {
    const cart = await user.getCart();
    return { user, cart };
  })
  .then(async ({ user, cart }) => {
    if (!cart) {
      cart = await user.createCart();
    }
    return cart;
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
