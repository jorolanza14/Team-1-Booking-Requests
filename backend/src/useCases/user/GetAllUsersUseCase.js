/**
 * Use Case: Get all users (Admin)
 */
class GetAllUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(options, user) {
    const { page, limit, filters } = this._prepareFilters(options, user);

    return await this.userRepository.findAll({
      page,
      limit,
      filters,
      include: [],
    });
  }

  _prepareFilters(options, user) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const filters = { ...options.filters };

    // Only active users by default
    if (filters.isActive === undefined) {
      filters.isActive = true;
    }

    return { page, limit, filters };
  }
}

module.exports = GetAllUsersUseCase;
