/**
 * Use Case: Update booking status
 */
class UpdateBookingStatusUseCase {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, status, notes, user) {
    // Check role permission
    const allowedRoles = ['diocese_staff', 'diocese_admin', 'parish_admin', 'parish_staff', 'priest'];
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Access denied: Only authorized personnel can update booking status');
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Get booking
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Update status and notes
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    return await this.bookingRepository.update(id, updateData);
  }
}

module.exports = UpdateBookingStatusUseCase;
