const boom = require('@hapi/boom');
const { config } = require('../config/config')
const { models } = require('../libs/sequelize');
const { Sequelize, Op, fn, col } = require('sequelize');


class InventoryService {
  async create(data) {
    const inventory = await models.Inventory.create(data);
    return inventory
  }

  async find({page = 1, pageSize = 10, filters = {}} = {}) {

    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const where = {};

    if(filters.status) {
      where[Op.or] = [
        { status: { [Op.iLike]: `%${filters.status}%` } }
      ];
    }

    if (filters.productName) {
      where[Op.or] = [
        {
          '$sales.products.name$': { [Op.iLike]: `%${filters.productName}%` }
        }
      ];
    }

    const include = [
      {
        model: models.Sales,
        as: 'sales',
        include: [
          {
            model: models.Product,
            as: 'products',
            attributes: ['name'],
          },
        ],
      },
    ];

    if (filters.salesId) {
      where.salesId = { [Op.eq]: parseInt(filters.salesId) };
    }

    if (filters.createdAt) {
      where[Op.and] = [
        Sequelize.where(
          fn('TO_CHAR', col('Inventory.created_at'), 'YYYY-MM-DD'),
          { [Op.iLike]: `%${filters.createdAt}%` }
        )
      ];
    }

    const { count, rows } = await models.Inventory.findAndCountAll({
      where,
      include,
      limit,
      offset
    });

    if(count === 0) {
      throw boom.notFound('No se encontraron registros');

    }

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page) || 1,
      data: rows
    }
  }

  async findAll () {
    const inventory = await models.Inventory.findAll();
    return inventory;
  }


  async findOne(id) {
    const inventory = await models.Inventory.findByPk(id);
    if(!inventory) {
      throw boom.notFound('Inventory not found');
    }
    return inventory;
  }

  async update() {

  }

  async delete() {

  }
}

module.exports = InventoryService;
