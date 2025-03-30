const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../../utils/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = OrderItem;
