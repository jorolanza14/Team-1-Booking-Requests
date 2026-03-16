/**
 * Use Case: Get booking by ID
 */
class GetBookingByIdUseCase {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, user) {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check permissions
    this._checkAccessPermission(booking, user);

    return booking;
  }

  _checkAccessPermission(booking, user) {
    const adminRoles = ['diocese_staff', 'diocese_admin', 'parish_admin'];
    
    if (adminRoles.includes(user.role)) {
      return;
    }

    if (user.role === 'parishioner' && booking.userId !== user.userId) {
      throw new Error('Access denied: You can only view your own bookings');
    }
  }
}

module.exports = GetBookingByIdUseCase;
