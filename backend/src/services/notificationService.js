const emailService = require('./emailService');

class NotificationService {
  constructor() {
    this.emailService = emailService;
  }

  /**
   * Sends a booking-related notification
   */
  async sendBookingNotification(user, booking, type = 'confirmation') {
    try {
      switch (type) {
        case 'confirmation':
          return await this.emailService.sendBookingConfirmation(user, booking);
        case 'update':
          return await this.emailService.sendNotification(
            user.email,
            'Booking Update - Diocese of Kalookan',
            `<h2>Booking Update</h2>
             <p>Dear ${user.firstName} ${user.lastName},</p>
             <p>Your booking status has been updated.</p>
             <p><strong>Booking Details:</strong></p>
             <ul>
               <li>Type: ${booking.bookingType}</li>
               <li>Date: ${new Date(booking.requestedDate).toLocaleDateString()}</li>
               <li>New Status: ${booking.status}</li>
               <li>Reference Number: ${booking.id}</li>
             </ul>
             <br>
             <p>Best regards,<br>
             The Diocese of Kalookan Team</p>`
          );
        case 'cancellation':
          return await this.emailService.sendNotification(
            user.email,
            'Booking Cancelled - Diocese of Kalookan',
            `<h2>Booking Cancelled</h2>
             <p>Dear ${user.firstName} ${user.lastName},</p>
             <p>Your booking has been cancelled.</p>
             <p><strong>Booking Details:</strong></p>
             <ul>
               <li>Type: ${booking.bookingType}</li>
               <li>Date: ${new Date(booking.requestedDate).toLocaleDateString()}</li>
               <li>Status: ${booking.status}</li>
               <li>Reference Number: ${booking.id}</li>
             </ul>
             <br>
             <p>Best regards,<br>
             The Diocese of Kalookan Team</p>`
          );
        default:
          throw new Error(`Unknown notification type: ${type}`);
      }
    } catch (error) {
      console.error(`Error sending booking ${type} notification:`, error);
      throw error;
    }
  }

  /**
   * Sends a user registration notification
   */
  async sendRegistrationNotification(user) {
    try {
      return await this.emailService.sendWelcomeEmail(user);
    } catch (error) {
      console.error('Error sending registration notification:', error);
      throw error;
    }
  }

  /**
   * Sends a password change notification
   */
  async sendPasswordChangeNotification(user) {
    try {
      return await this.emailService.sendPasswordChangeNotification(user);
    } catch (error) {
      console.error('Error sending password change notification:', error);
      throw error;
    }
  }

  /**
   * Sends a mass intention notification
   */
  async sendMassIntentionNotification(user, intention, type = 'submitted') {
    try {
      let subject, message;
      
      switch (type) {
        case 'submitted':
          subject = 'Mass Intention Submitted - Diocese of Kalookan';
          message = `<h2>Mass Intention Submitted</h2>
                     <p>Dear ${user.firstName} ${user.lastName},</p>
                     <p>Your mass intention has been successfully submitted.</p>
                     <p><strong>Intention Details:</strong></p>
                     <ul>
                       <li>For: ${intention.intentionFor || 'N/A'}</li>
                       <li>Date: ${new Date(intention.massDate).toLocaleDateString()}</li>
                       <li>Type: ${intention.intentionType}</li>
                       <li>Status: ${intention.status}</li>
                       <li>Offering: ₱${intention.offeringAmount || '0.00'}</li>
                     </ul>
                     <br>
                     <p>Best regards,<br>
                     The Diocese of Kalookan Team</p>`;
          break;
        case 'confirmed':
          subject = 'Mass Intention Confirmed - Diocese of Kalookan';
          message = `<h2>Mass Intention Confirmed</h2>
                     <p>Dear ${user.firstName} ${user.lastName},</p>
                     <p>Your mass intention has been confirmed.</p>
                     <p><strong>Confirmed Details:</strong></p>
                     <ul>
                       <li>For: ${intention.intentionFor || 'N/A'}</li>
                       <li>Date: ${new Date(intention.massDate).toLocaleDateString()}</li>
                       <li>Type: ${intention.intentionType}</li>
                       <li>Status: ${intention.status}</li>
                       <li>Offering: ₱${intention.offeringAmount || '0.00'}</li>
                     </ul>
                     <br>
                     <p>Best regards,<br>
                     The Diocese of Kalookan Team</p>`;
          break;
        default:
          throw new Error(`Unknown mass intention notification type: ${type}`);
      }
      
      return await this.emailService.sendNotification(user.email, subject, message);
    } catch (error) {
      console.error(`Error sending mass intention ${type} notification:`, error);
      throw error;
    }
  }

  /**
   * Sends a general notification to a user
   */
  async sendGeneralNotification(user, subject, message) {
    try {
      return await this.emailService.sendNotification(user.email, subject, message);
    } catch (error) {
      console.error('Error sending general notification:', error);
      throw error;
    }
  }

  /**
   * Sends a system-wide notification to multiple users
   */
  async sendSystemNotification(users, subject, message) {
    const results = [];
    const errors = [];

    for (const user of users) {
      try {
        const result = await this.emailService.sendNotification(user.email, subject, message);
        results.push({ user: user.id, success: true, result });
      } catch (error) {
        errors.push({ user: user.id, success: false, error: error.message });
      }
    }

    return {
      sent: results.length,
      errors: errors.length,
      results,
      errors
    };
  }

  /**
   * Verifies that notification services are configured properly
   */
  async verifyServices() {
    try {
      const emailVerified = await this.emailService.verifyConnection();
      return {
        email: emailVerified,
        allServices: emailVerified,
      };
    } catch (error) {
      console.error('Error verifying notification services:', error);
      return {
        email: false,
        allServices: false,
        error: error.message,
      };
    }
  }
}

module.exports = new NotificationService();