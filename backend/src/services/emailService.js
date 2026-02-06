const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this.from = process.env.EMAIL_FROM || '"Diocese of Kalookan" <noreply@diocese-kalookan.com>';
  }

  /**
   * Sends a welcome email to a new user
   */
  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: 'Welcome to Diocese of Kalookan',
      html: `
        <h2>Welcome to Diocese of Kalookan, ${user.firstName}!</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Thank you for registering with our Diocese of Kalookan application. Your account has been successfully created.</p>
        <p>You can now access our sacramental services and manage your bookings.</p>
        <br>
        <p>Best regards,<br>
        The Diocese of Kalookan Team</p>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  /**
   * Sends a booking confirmation email
   */
  async sendBookingConfirmation(user, booking) {
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: 'Booking Confirmation - Diocese of Kalookan',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your booking has been successfully submitted and is currently under review.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Type: ${booking.bookingType}</li>
          <li>Requested Date: ${new Date(booking.requestedDate).toLocaleDateString()}</li>
          <li>Status: ${booking.status}</li>
          <li>Reference Number: ${booking.id}</li>
        </ul>
        <p>We will notify you once your booking has been confirmed by our staff.</p>
        <br>
        <p>Best regards,<br>
        The Diocese of Kalookan Team</p>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw new Error(`Failed to send booking confirmation email: ${error.message}`);
    }
  }

  /**
   * Sends a password change notification
   */
  async sendPasswordChangeNotification(user) {
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: 'Password Changed - Diocese of Kalookan',
      html: `
        <h2>Password Change Notification</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your password has been successfully changed on ${new Date().toLocaleString()}.</p>
        <p>If you did not initiate this change, please contact our support immediately.</p>
        <br>
        <p>Best regards,<br>
        The Diocese of Kalookan Team</p>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password change notification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password change notification email:', error);
      throw new Error(`Failed to send password change notification email: ${error.message}`);
    }
  }

  /**
   * Sends a general notification email
   */
  async sendNotification(to, subject, message) {
    const mailOptions = {
      from: this.from,
      to,
      subject,
      html: message,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending notification email:', error);
      throw new Error(`Failed to send notification email: ${error.message}`);
    }
  }

  /**
   * Verifies the email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server configuration verified successfully');
      return true;
    } catch (error) {
      console.error('Email server configuration verification failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();