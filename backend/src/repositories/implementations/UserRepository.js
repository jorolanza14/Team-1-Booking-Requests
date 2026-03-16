/**
 * Sequelize Implementation of User Repository
 */
const { User } = require('../../models');
const { Op } = require('sequelize');

class UserRepository {
  /**
   * Creates a new user
   */
  async create(dto) {
    const entity = await User.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
      assignedParishId: dto.assignedParishId,
    });

    return UserDTO.fromEntity(entity);
  }

  /**
   * Finds a user by ID
   */
  async findById(id) {
    const entity = await User.findByPk(id);
    return UserDTO.fromEntity(entity);
  }

  /**
   * Finds a user by email
   */
  async findByEmail(email) {
    const entity = await User.findOne({ where: { email } });
    return UserDTO.fromEntity(entity);
  }

  /**
   * Finds a user by Google ID
   */
  async findByGoogleId(googleId) {
    const entity = await User.findOne({ where: { googleId } });
    return UserDTO.fromEntity(entity);
  }

  /**
   * Finds all users with pagination and filtering
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      filters = {},
      include = [],
      orderBy = [['createdAt', 'DESC']],
    } = options;

    const offset = (page - 1) * limit;
    const whereClause = this._buildWhereClause(filters);

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      include,
      limit,
      offset,
      order: orderBy,
    });

    return {
      data: UserDTO.fromEntities(rows),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Updates a user
   */
  async update(id, data) {
    const entity = await User.findByPk(id);
    if (!entity) {
      throw new Error('User not found');
    }

    await entity.update(data);
    return UserDTO.fromEntity(entity);
  }

  /**
   * Deletes a user (soft delete)
   */
  async delete(id) {
    const entity = await User.findByPk(id);
    if (!entity) {
      throw new Error('User not found');
    }

    await entity.update({ isActive: false });
    return true;
  }

  /**
   * Searches users by email or name
   */
  async search(searchTerm) {
    const entities = await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: `%${searchTerm}%` } },
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } },
        ],
        isActive: true,
      },
    });

    return UserDTO.fromEntities(entities);
  }

  /**
   * Updates user password
   */
  async updatePassword(id, newPassword) {
    const entity = await User.findByPk(id);
    if (!entity) {
      throw new Error('User not found');
    }

    await entity.update({ password: newPassword });
    return UserDTO.fromEntity(entity);
  }

  /**
   * Updates user last login timestamp
   */
  async updateLastLogin(id) {
    const entity = await User.findByPk(id);
    if (!entity) {
      throw new Error('User not found');
    }

    await entity.update({ lastLoginAt: new Date() });
    return UserDTO.fromEntity(entity);
  }

  /**
   * Builds WHERE clause from filters
   */
  _buildWhereClause(filters) {
    const where = {};

    if (filters.role) where.role = filters.role;
    if (filters.assignedParishId) where.assignedParishId = filters.assignedParishId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.googleId) where.googleId = filters.googleId;

    return where;
  }
}

// Need to import DTO after module.exports to avoid circular dependency
const UserDTO = require('../../dto/UserDTO');

module.exports = UserRepository;
