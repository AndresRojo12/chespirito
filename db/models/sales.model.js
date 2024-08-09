const { Model, DataTypes, Sequelize } = require('sequelize');

const SALES_TABLE = 'sales';
const { USER_TABLE } = require('../models/user.model');
const { CATEGORY_TABLE } = require('../models/category.model');
const { PRODUCT_TABLE } = require('../models/product.model');

const SalesSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  quantitySold: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'quantity_sold',
  },
  salePrice: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'sale_price',
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'category_id',
    references: {
      model: CATEGORY_TABLE,
      key: 'id',
    },
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id',
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    field: 'updated_by',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    field: 'deleted_by',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
};

class Sales extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'creator', foreignKey: 'created_by' });
    this.belongsTo(models.User, { as: 'updator', foreignKey: 'updated_by' });
    this.belongsTo(models.User, { as: 'deletor', foreignKey: 'deleted_by' });
    this.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id',
    });
    this.belongsTo(models.Product, {
      as: 'products',
      foreignKey: 'product_id',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: SALES_TABLE,
      modelName: 'Sales',
      timestamps: false,
    };
  }
}

module.exports = { SALES_TABLE, SalesSchema, Sales };
