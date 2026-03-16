/**
 * Use Case: Update user profile
 * Single responsibility: Handle user profile updates
 */
const UserDTO = require('../../dto/UserDTO');

class UpdateUserProfileUseCase {
  /**
   * @param {IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case
   * @param {number} userId - The user ID
   * @param {UserDTO} dto - The profile update data
   * @returns {Promise<UserDTO>}
   */
  async execute(userId, dto) {
    // Validate input
    const validation = dto.validateForProfileUpdate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Get allowed fields for profile update
    const allowedFields = ['firstName', 'lastName', 'phone', 'address'];
    const updateData = dto.getAllowedUpdates(allowedFields);

    // Perform update
    return await this.userRepository.update(userId, updateData);
  }
}

module.exports = UpdateUserProfileUseCase;
