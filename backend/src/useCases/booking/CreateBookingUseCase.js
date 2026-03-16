/**
 * Use Case: Create a new booking
 */
class CreateBookingUseCase {
  constructor(bookingRepository, parishRepository, emailService) {
    this.bookingRepository = bookingRepository;
    this.parishRepository = parishRepository;
    this.emailService = emailService;
  }

  async execute(dto, user) {
    // Validate input
    const validation = dto.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Verify parish exists
    const parish = await this.parishRepository.findById(dto.parishId);
    if (!parish) {
      throw new Error('Parish not found');
    }

    // Set user ID if not provided
    dto.userId = user.userId;

    // Create booking
    const createdBooking = await this.bookingRepository.create(dto);

    // Send confirmation email (non-blocking)
    this._sendConfirmationEmail(user, createdBooking).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });

    return createdBooking;
  }

  async _sendConfirmationEmail(user, booking) {
    if (!this.emailService) return;
    await this.emailService.sendBookingConfirmation(user, booking);
  }
}

module.exports = CreateBookingUseCase;
