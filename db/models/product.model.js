const { Model, DataTypes, Sequelize } = require('sequelize');

const { USER_TABLE } = require('./user.model');
const { CATEGORY_TABLE } = require('../models/category.model');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
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
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg:"Debe insertar un nombre"
      },
      len:{
        args:[8,50],
        msg: "El nombre debe terner como minimo 8 caracteres"
      }
    }
  },
  status: {
    allowNull: false,
    type: DataTypes.DECIMAL,
    validate: {
      isDecimal: {
        msg: "El estado debe ser un número decimal",
      },
      min: {
        args: [1],
        msg: "El estado debe ser al menos 1",
      },
      max: {
        args: [10],
        msg: "El estado no puede ser mayor a 10",
      },
    },
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING(500),
    validate: {
      notEmpty: {
        msg: "La descripción es requerida",
      },
      len: {
        args: [10, 500],
        msg: "La descripción debe tener entre 10 y 500 caracteres",
      },
    },
  },
  imagePath1: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'anverso',
  },
  imagePath2: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'reverso',
  },
  price: {
    allowNull: false,
    type: DataTypes.DECIMAL,
    validate: {
      isDecimal: {
        msg: "El precio debe ser un número decimal",
      },
      min: {
        args: [1000],
        msg: "El precio debe ser al menos 1000",
      },
      max: {
        args: [20000000],
        msg: "El precio no puede exceder 20000000",
      },
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

class Product extends Model {
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

    this.belongsTo(models.Category, {
      as: 'category',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false,
    };
  }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product };
