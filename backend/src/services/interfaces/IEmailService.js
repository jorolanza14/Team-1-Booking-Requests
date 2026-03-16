/**
 * Email Service Interface
 * Defines the contract for email operations
 */
class IEmailService {
  /**
   * Sends a welcome email to a new user
   * @param {UserDTO} user - The user data
   * @returns {Promise<Object>}
   */
  async sendWelcomeEmail(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Sends a booking confirmation email
   * @param {UserDTO} user - The user data
   * @param {Object} booking - The booking data
   * @returns {Promise<Object>}
   */
  async sendBookingConfirmation(user, booking) {
    throw new Error('Method not implemented');
  }

  /**
   * Sends a password change notification
   * @param {UserDTO} user - The user data
   * @returns {Promise<Object>}
   */
  async sendPasswordChangeNotification(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Sends a general notification email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} message - HTML message
   * @returns {Promise<Object>}
   */
  async sendNotification(to, subject, message) {
    throw new Error('Method not implemented');
  }

  /**
   * Verifies the email configuration
   * @returns {Promise<boolean>}
   */
  async verifyConnection() {
    throw new Error('Method not implemented');
  }
}

module.exports = IEmailService;
