/**
 * Repository Interface for Booking
 */
class IBookingRepository {
  /**
   * Creates a new booking
   * @param {BookingDTO} dto - The booking data
   * @returns {Promise<BookingDTO>}
   */
  async create(dto) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a booking by ID
   * @param {number} id - The booking ID
   * @returns {Promise<BookingDTO|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds all bookings with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<{data: BookingDTO[], total: number}>}
   */
  async findAll(options) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a booking
   * @param {number} id - The booking ID
   * @param {Object} data - The update data
   * @returns {Promise<BookingDTO>}
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a booking
   * @param {number} id - The booking ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates booking status
   * @param {number} id - The booking ID
   * @param {string} status - The new status
   * @returns {Promise<BookingDTO>}
   */
  async updateStatus(id, status) {
    throw new Error('Method not implemented');
  }

  /**
   * Counts bookings by status
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>}
   */
  async countByStatus(filters) {
    throw new Error('Method not implemented');
  }

  /**
   * Counts bookings by type
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>}
   */
  async countByType(filters) {
    throw new Error('Method not implemented');
  }
}

module.exports = IBookingRepository;
