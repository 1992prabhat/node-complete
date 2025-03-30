const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "prabhat92", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
