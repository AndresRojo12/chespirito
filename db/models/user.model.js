const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users'

const UserSchema = {

  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  email: {
    allowNull:true,
    type:DataTypes.STRING,
    unique:true
  },

  password: {
    allowNull:false,
    type:DataTypes.STRING,
  },
  role: {
    allowNull:false,
    type:DataTypes.STRING,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    field: 'updated_by',
    references: {
      model: USER_TABLE,
      key: 'id'
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
  deletedBy: {
    type: DataTypes.INTEGER,
    field: 'deleted_by',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
}

class User extends Model {
  static associate(models) {
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName : USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = {
  USER_TABLE,
  UserSchema,
  User
};
