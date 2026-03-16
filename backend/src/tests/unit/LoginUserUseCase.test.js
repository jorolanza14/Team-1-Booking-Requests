/**
 * Unit Tests for LoginUserUseCase
 * Note: These tests verify the login business logic flow.
 * Bcrypt is tested separately; here we focus on use case behavior.
 */

const LoginUserUseCase = require('../../useCases/auth/LoginUserUseCase');
const UserDTO = require('../../dto/UserDTO');

describe('LoginUserUseCase', () => {
  let useCase;
  let mockUserRepository;
  let mockTokenService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      updateLastLogin: jest.fn(),
    };
    mockTokenService = {
      generateTokens: jest.fn(),
    };

    useCase = new LoginUserUseCase(mockUserRepository, mockTokenService);
  });

  describe('execute', () => {
    it('should throw error for invalid email format', async () => {
      const dto = new UserDTO({
        email: 'invalid-email',
        password: 'password123',
      });

      await expect(useCase.execute(dto)).rejects.toThrow('Valid email is required');
    });

    it('should throw error for missing password', async () => {
      const dto = new UserDTO({
        email: 'test@example.com',
      });

      await expect(useCase.execute(dto)).rejects.toThrow('Password is required');
    });

    it('should throw error for non-existent user', async () => {
      const dto = new UserDTO({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for disabled account', async () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
      });

      const user = {
        id: 1,
        email: 'test@example.com',
        password: null, // No password means OAuth user or special case
        isActive: false,
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid credentials');
    });
  });
});
