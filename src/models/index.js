'use strict';

const Sequelize = require('sequelize');
const { envs } = require('../../config');


const UserModel = require("./user");
const RoleModel = require("./role");
const InventoryModel = require("./inventory");
const OrderModel = require("./order");
const OrderItemModel = require("./orderItem");

const sequelize = new Sequelize(envs.DB_URL, {
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 90000,
  }
});

const db = {
  User: UserModel(sequelize, Sequelize.DataTypes),
  Role: RoleModel(sequelize, Sequelize.DataTypes),
  Inventory: InventoryModel(sequelize, Sequelize.DataTypes),
  Order: OrderModel(sequelize, Sequelize.DataTypes),
  OrderItem: OrderItemModel(sequelize, Sequelize.DataTypes),
  // sequelize,
  // Sequelize
};

// Initialize associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

async function connectDatabase() {

  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
}

module.exports = { db, connectDatabase, sequelize };