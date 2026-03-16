/**
 * Use Case: Login user
 * Single responsibility: Handle user authentication
 */
const UserDTO = require('../../dto/UserDTO');

class LoginUserUseCase {
  /**
   * @param {IUserRepository} userRepository
   * @param {ITokenService} tokenService
   */
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  /**
   * Executes the use case
   * @param {UserDTO} dto - The login credentials
   * @returns {Promise<{user: UserDTO, accessToken: string, refreshToken: string}>}
   */
  async execute(dto) {
    // Validate input
    const validation = dto.validateForLogin();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this._verifyPassword(dto.password, user);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account disabled');
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = this.tokenService.generateTokens(user);

    return {
      user: user.toSafeObject(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Verifies user password
   */
  async _verifyPassword(password, user) {
    const bcrypt = require('bcrypt');
    if (!user.password) return false;
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = LoginUserUseCase;
