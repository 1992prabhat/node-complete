const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../../utils/database");

const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Cart;
