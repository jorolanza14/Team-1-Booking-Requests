/**
 * Use Case: Change user password
 * Single responsibility: Handle password changes
 */
const bcrypt = require('bcrypt');

class ChangePasswordUseCase {
  /**
   * @param {IUserRepository} userRepository
   * @param {IEmailService} emailService
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  /**
   * Executes the use case
   * @param {number} userId - The user ID
   * @param {string} oldPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Promise<{message: string}>}
   */
  async execute(userId, oldPassword, newPassword) {
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValidPassword = await this._verifyPassword(oldPassword, user);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    await this.userRepository.updatePassword(userId, newPassword);

    // Send notification email (non-blocking)
    this._sendPasswordChangeNotification(user).catch(err => {
      console.error('Failed to send password change notification:', err);
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Verifies user password
   */
  async _verifyPassword(password, user) {
    if (!user.password) return false;
    return await bcrypt.compare(password, user.password);
  }

  /**
   * Sends password change notification email
   */
  async _sendPasswordChangeNotification(user) {
    if (!this.emailService) return;
    
    await this.emailService.sendPasswordChangeNotification(user);
  }
}

module.exports = ChangePasswordUseCase;
