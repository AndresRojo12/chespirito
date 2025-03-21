const boom = require('@hapi/boom');
const { config } = require('../config/config');
const { models } = require('../libs/sequelize');
const { Sequelize, Op, fn, col } = require('sequelize');

const { createInventorySchema } = require('../schemas/inventory.schema');

class InventoryService {
  async create(data) {

    const { error, value } = createInventorySchema.validate(data);
    if(error) {
      throw boom.badRequest(error.details[0].message);
    }
    try {
      const inventory = await models.Inventory.create(data);
      return inventory;
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(e => e.message);
        throw boom.badRequest(messages.join(', '));
      }
      throw error;
    }
  }

  async find({ page = 1, pageSize = 10, filters = {} } = {}) {
    const limit = parseInt(pageSize) || 10;
    const offset = ((parseInt(page) || 1) - 1) * limit;

    const where = {};

    if (filters.status) {
      where.status = { [Op.iLike]: `%${filters.status}%` };
    }

    if (filters.productName) {
      where['$sales.products.name$'] = {
        [Op.iLike]: `%${filters.productName}%`,
      };
    }

    if (filters.salesId) {
      where.salesId = { [Op.eq]: parseInt(filters.salesId) };
    }

    if (filters.createdAt) {
      const formattedDate = `%${filters.createdAt}%`;
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(
          fn('TO_CHAR', col('Inventory.created_at'), 'DD/MM/YYYY'),
          { [Op.iLike]: formattedDate },
        ),
      ];
    }

    if (filters.updatedAt) {
      const formattedDate = `%${filters.updatedAt}%`;
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(
          fn('TO_CHAR', col('Inventory.updated_at'), 'DD/MM/YYYY'),
          { [Op.iLike]: formattedDate },
        ),
      ];
    }

    const { count, rows } = await models.Inventory.findAndCountAll({
      where,
      include: [
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
      ],
      limit,
      offset,
    });

    if (count === 0) {
      throw boom.notFound(
        'No se encontraron registros que coincidan con los criterios de búsqueda',
      );
    }

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page) || 1,
      data: rows,
    };
  }

  async findAll() {
    const inventory = await models.Inventory.findAll();
    return inventory;
  }

  async findOne(id) {
    const inventory = await models.Inventory.findByPk(id);
    if (!inventory) {
      throw boom.notFound('Inventory not found');
    }
    return inventory;
  }

  async update(id, changes, userId) {
    const inventory = await this.findOne(id);
    changes.updatedBy = userId;
    changes.updatedAt = new Date();

    await inventory.update(changes);
    return inventory;
  }

  async delete(id) {
    const inventory = await this.findOne(id);
    await inventory.destroy();
    return { id };
  }
}

module.exports = InventoryService;
