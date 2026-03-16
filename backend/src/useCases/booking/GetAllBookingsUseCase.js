/**
 * Use Case: Get all bookings
 */
class GetAllBookingsUseCase {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(options, user) {
    const { page, limit, filters } = this._prepareFilters(options, user);

    return await this.bookingRepository.findAll({
      page,
      limit,
      filters,
    });
  }

  _prepareFilters(options, user) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const filters = { ...options.filters };

    // Role-based access control
    if (user.role === 'parishioner') {
      filters.userId = user.userId;
    }

    return { page, limit, filters };
  }
}

module.exports = GetAllBookingsUseCase;
