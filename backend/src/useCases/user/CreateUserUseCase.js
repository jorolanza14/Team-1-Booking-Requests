/**
 * Use Case: Create a new user (Admin)
 */
const UserDTO = require('../../dto/UserDTO');

class CreateUserUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute(dto, user) {
    // Check admin permission
    if (!['diocese_staff', 'diocese_admin'].includes(user.role)) {
      throw new Error('Access denied: Only admins can create users');
    }

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
    return await this.userRepository.create(dto);
  }
}

module.exports = CreateUserUseCase;
