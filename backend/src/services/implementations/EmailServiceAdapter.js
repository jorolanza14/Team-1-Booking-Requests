/**
 * Email Service Adapter
 * Wraps the existing emailService to implement the IEmailService interface
 */
const emailService = require('../emailService');

class EmailServiceAdapter {
  /**
   * Sends a welcome email to a new user
   */
  async sendWelcomeEmail(user) {
    return await emailService.sendWelcomeEmail(user);
  }

  /**
   * Sends a booking confirmation email
   */
  async sendBookingConfirmation(user, booking) {
    return await emailService.sendBookingConfirmation(user, booking);
  }

  /**
   * Sends a password change notification
   */
  async sendPasswordChangeNotification(user) {
    return await emailService.sendPasswordChangeNotification(user);
  }

  /**
   * Sends a general notification email
   */
  async sendNotification(to, subject, message) {
    return await emailService.sendNotification(to, subject, message);
  }

  /**
   * Verifies the email configuration
   */
  async verifyConnection() {
    return await emailService.verifyConnection();
  }
}

module.exports = EmailServiceAdapter;
