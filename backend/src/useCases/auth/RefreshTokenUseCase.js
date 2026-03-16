/**
 * Use Case: Refresh access token
 * Single responsibility: Handle token refresh
 */
class RefreshTokenUseCase {
  /**
   * @param {IUserRepository} userRepository
   * @param {ITokenService} tokenService
   * @param {ITokenBlacklistRepository} tokenBlacklistRepository
   */
  constructor(userRepository, tokenService, tokenBlacklistRepository) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.tokenBlacklistRepository = tokenBlacklistRepository;
  }

  /**
   * Executes the use case
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<{accessToken: string}>}
   */
  async execute(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token required');
    }

    // Check if token is blacklisted
    const isBlacklisted = await this.tokenBlacklistRepository.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    // Find user
    const user = await this.userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or account is inactive');
    }

    // Generate new access token
    const accessToken = this.tokenService.generateAccessToken(user);

    return { accessToken };
  }
}

module.exports = RefreshTokenUseCase;
