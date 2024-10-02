const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORY_TABLE = 'categories';
const { USER_TABLE } = require('./user.model');

const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING(255),
    unique: true,
    validate: {
      notEmpty: {
        msg:"Debe ingresar un nombre",
      },
      len: {
        args: [8,255],
        msg: "El nombre debe tener entre 8 y 200 caracteres",
      },
    }
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg:"La descripción no puede estar vacia",
      },
      len: {
        args: [10,500],
        msg: "La descripción debe tener entre 10 y 500 caracteres"
      }
    }
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty:{
        msg:"Debe proporcionar una imagen"
      }
    }
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

class Category extends Model {
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

    this.hasMany(models.Product, {
      as:'products',
      foreignKey: 'categoryId'
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Category',
      timestamps: false,
    };
  }
}

module.exports = { CATEGORY_TABLE, CategorySchema, Category };
