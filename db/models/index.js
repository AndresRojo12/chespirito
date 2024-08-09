const sequelize = require('../../libs/sequelize');

const { User, UserSchema } = require('./user.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Sales, SalesSchema } = require('../models/sales.model');
const { Inventory, InventorySchema } = require('../models/inventory.model');


const setupModels = (sequelize) => {
  User.init(UserSchema, User.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Sales.init(SalesSchema, Sales.config(sequelize));
  Inventory.init(InventorySchema, Inventory.config(sequelize));

  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Sales.associate(sequelize.models);
  Inventory.associate(sequelize.models);

};

module.exports = setupModels;
