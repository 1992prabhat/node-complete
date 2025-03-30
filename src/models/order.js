const { Sequelize, DataTypes, DOUBLE } = require("sequelize");

const sequelize = require("../../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  order_total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = Order;
