/*
En el modelo de categoria como primer paso se debe importar
el modelo de usuario para su asociación y poder crear categorias
correctamente

ejemplo de importación */

const { USER_TABLE } =require('./user.model')


/*
En los datos de control se debe hacer referencia a la tabla
del modelo usuario importado

ejemplo de refencia*/

/*created_at: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.NOW,
},
created_by: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: USER_TABLE,
    key: 'id',
  },
},
updated_at: {
  type: DataTypes.DATE,
},
updated_by: {
  type: DataTypes.INTEGER,
  references: {
    model: USER_TABLE,
    key: 'id',
  },
},
deleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
deleted_at: {
  type: DataTypes.DATE,
},
deleted_by: {
  type: DataTypes.INTEGER,
  references: {
    model: USER_TABLE,
    key: 'id',
  },
},*/

/* se debe tener en cuenta que el usuario administrador
es el que hace todo como subir eliminar etc por eso se hace
la referencia a la tabla de usuario */

/* asociacion

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

    se hace referencia al modelo con belongsTo
    porque la categoria va a pertenecer al usuario que la creo
    y la foreignKey se haria la referencia a los datos de control
*/
