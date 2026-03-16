/**
 * Sequelize Implementation of Booking Repository
 */
const { Booking, User, Parish } = require('../../models');
const { Op } = require('sequelize');

class BookingRepository {
  /**
   * Creates a new booking
   */
  async create(dto) {
    const entity = await Booking.create({
      userId: dto.userId,
      parishId: dto.parishId,
      bookingType: dto.bookingType,
      requestedDate: dto.requestedDate,
      status: dto.status,
      notes: dto.notes,
      documents: dto.documents,
      additionalInfo: dto.additionalInfo,
    });

    return BookingDTO.fromEntity(entity);
  }

  /**
   * Finds a booking by ID
   */
  async findById(id, includes = []) {
    const entity = await Booking.findByPk(id, {
      include: includes.length > 0 ? includes : [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Parish, as: 'parish', attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone'] },
      ],
    });

    return BookingDTO.fromEntity(entity);
  }

  /**
   * Finds all bookings with pagination and filtering
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      filters = {},
      includes = [],
      orderBy = [['requestedDate', 'DESC']],
    } = options;

    const offset = (page - 1) * limit;
    const whereClause = this._buildWhereClause(filters);

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: includes.length > 0 ? includes : [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Parish, as: 'parish', attributes: ['id', 'name'] },
      ],
      limit,
      offset,
      order: orderBy,
    });

    return {
      data: BookingDTO.fromEntities(rows),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Updates a booking
   */
  async update(id, data) {
    const entity = await Booking.findByPk(id);
    if (!entity) {
      throw new Error('Booking not found');
    }

    await entity.update(data);
    return BookingDTO.fromEntity(entity);
  }

  /**
   * Deletes a booking
   */
  async delete(id) {
    const entity = await Booking.findByPk(id);
    if (!entity) {
      throw new Error('Booking not found');
    }

    await entity.destroy();
    return true;
  }

  /**
   * Updates booking status
   */
  async updateStatus(id, status) {
    const entity = await Booking.findByPk(id);
    if (!entity) {
      throw new Error('Booking not found');
    }

    await entity.update({ status });
    return BookingDTO.fromEntity(entity);
  }

  /**
   * Counts bookings by status
   */
  async countByStatus(filters = {}) {
    const whereClause = this._buildWhereClause(filters);
    const results = await Booking.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    return results.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});
  }

  /**
   * Counts bookings by type
   */
  async countByType(filters = {}) {
    const { sequelize } = require('../../config/database');
    const whereClause = this._buildWhereClause(filters);
    const results = await Booking.findAll({
      where: whereClause,
      attributes: [
        'bookingType',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['bookingType'],
      raw: true,
    });

    return results.reduce((acc, item) => {
      acc[item.bookingType] = parseInt(item.count);
      return acc;
    }, {});
  }

  /**
   * Builds WHERE clause from filters
   */
  _buildWhereClause(filters) {
    const where = {};

    if (filters.status) where.status = filters.status;
    if (filters.parishId) where.parishId = filters.parishId;
    if (filters.bookingType) where.bookingType = filters.bookingType;
    if (filters.userId) where.userId = filters.userId;

    // Date range filtering
    if (filters.startDate || filters.endDate) {
      where.requestedDate = {};
      if (filters.startDate) where.requestedDate[Op.gte] = filters.startDate;
      if (filters.endDate) where.requestedDate[Op.lte] = filters.endDate;
    }

    return where;
  }
}

// Import DTO after module.exports to avoid circular dependency
const BookingDTO = require('../../dto/BookingDTO');
const { sequelize } = require('../../config/database');

module.exports = BookingRepository;
