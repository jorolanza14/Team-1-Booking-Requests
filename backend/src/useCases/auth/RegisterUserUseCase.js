/**
 * Use Case: Register a new user
 * Single responsibility: Handle user registration
 */
const UserDTO = require('../../dto/UserDTO');

class RegisterUserUseCase {
  /**
   * @param {IUserRepository} userRepository
   * @param {ITokenService} tokenService
   * @param {IEmailService} emailService
   */
  constructor(userRepository, tokenService, emailService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  /**
   * Executes the use case
   * @param {UserDTO} dto - The user registration data
   * @returns {Promise<{user: UserDTO, accessToken: string, refreshToken: string}>}
   */
  async execute(dto) {
    // Validate input
    const validation = dto.validateForRegistration();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const createdUser = await this.userRepository.create(dto);

    // Generate tokens
    const tokens = this.tokenService.generateTokens(createdUser);

    // Send welcome email (non-blocking)
    this._sendWelcomeEmail(createdUser).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    return {
      user: createdUser.toSafeObject(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Sends welcome email
   */
  async _sendWelcomeEmail(user) {
    if (!this.emailService) return;
    
    await this.emailService.sendWelcomeEmail(user);
  }
}

module.exports = RegisterUserUseCase;
