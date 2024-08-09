const { Model, DataTypes, Sequelize } = require('sequelize');

const { USER_TABLE } = require('./user.model');
const { SALES_TABLE } = require('../models/sales.model');

const INVENTORY_TABLE = 'inventory';

const InventorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  salesId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'sales_id',
    references: {
      model: SALES_TABLE,
      key: 'id',
    },
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
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
  updatedBy: {
    type: DataTypes.INTEGER,
    field: 'updated_by',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    field: 'deleted_by',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
};

class Inventory extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'created_by',
    });

    this.belongsTo(models.User, {
      as: 'updator',
      foreignKey: 'updated_by',
    });

    this.belongsTo(models.User, {
      as: 'deletor',
      foreignKey: 'deleted_by',
    });

    this.belongsTo(models.Sales, {
      as: 'sales'
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: INVENTORY_TABLE,
      modelName: 'Inventory',
      timestamps: false,
    };
  }
}

module.exports = { INVENTORY_TABLE, InventorySchema, Inventory };
