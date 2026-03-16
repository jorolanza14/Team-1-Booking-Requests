/**
 * Sequelize Implementation of Parish Repository
 */
const { Parish, SystemConfiguration } = require('../../models');
const { Op } = require('sequelize');

const ParishDTO = require('../../dto/ParishDTO');

class ParishRepository {
  /**
   * Creates a new parish
   */
  async create(data) {
    const entity = await Parish.create(data);
    return ParishDTO.fromEntity(entity);
  }

  /**
   * Finds a parish by ID
   */
  async findById(id) {
    return await Parish.findByPk(id);
  }

  /**
   * Finds all parishes with optional filtering
   */
  async findAll(options = {}) {
    const { isActive = true, attributes } = options;
    
    const whereCondition = isActive !== null ? { isActive } : {};

    const entities = await Parish.findAll({
      where: whereCondition,
      attributes: attributes || [
        'id', 'name', 'address', 'contactEmail', 'contactPhone', 
        'schedule', 'servicesOffered', 'isActive', 'createdAt', 'updatedAt'
      ],
    });

    return ParishDTO.fromEntities(entities);
  }

  /**
   * Counts parishes
   */
  async count(whereClause = {}) {
    return await Parish.count({ where: whereClause });
  }

  /**
   * Updates a parish
   */
  async update(id, data) {
    const parish = await Parish.findByPk(id);
    if (!parish) {
      throw new Error('Parish not found');
    }

    await parish.update(data);
    return parish;
  }

  /**
   * Deletes a parish (soft delete)
   */
  async delete(id) {
    const parish = await Parish.findByPk(id);
    if (!parish) {
      throw new Error('Parish not found');
    }

    await parish.update({ isActive: false });
    return true;
  }

  /**
   * Hard deletes a parish
   */
  async hardDelete(id) {
    const parish = await Parish.findByPk(id);
    if (!parish) {
      throw new Error('Parish not found');
    }

    await parish.destroy();
    return true;
  }

  /**
   * Searches parishes by query
   */
  async search(query) {
    const conditions = { isActive: true };

    if (query) {
      conditions[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { address: { [Op.iLike]: `%${query}%` } },
      ];
    }

    return await Parish.findAll({
      where: conditions,
      attributes: [
        'id', 'name', 'address', 'contactEmail', 'contactPhone', 
        'schedule', 'servicesOffered', 'isActive', 'createdAt', 'updatedAt'
      ],
    });
  }

  /**
   * Finds parishes by service offered
   */
  async findByService(service) {
    return await Parish.findAll({
      where: {
        isActive: true,
        servicesOffered: { [Op.contains]: [service] },
      },
      attributes: [
        'id', 'name', 'address', 'contactEmail', 'contactPhone', 
        'schedule', 'servicesOffered', 'isActive', 'createdAt', 'updatedAt'
      ],
    });
  }

  /**
   * Finds parish by name (case insensitive)
   */
  async findByName(name) {
    return await Parish.findOne({
      where: {
        name: { [Op.iLike]: name.trim() }
      }
    });
  }
}

module.exports = ParishRepository;
