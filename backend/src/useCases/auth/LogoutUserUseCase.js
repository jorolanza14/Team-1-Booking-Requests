/**
 * Use Case: Logout user
 * Single responsibility: Handle user logout by blacklisting token
 */
class LogoutUserUseCase {
  /**
   * @param {ITokenBlacklistRepository} tokenBlacklistRepository
   */
  constructor(tokenBlacklistRepository) {
    this.tokenBlacklistRepository = tokenBlacklistRepository;
  }

  /**
   * Executes the use case
   * @param {string} token - The access token to blacklist
   * @param {number} expiresAt - Token expiration timestamp
   * @returns {Promise<boolean>}
   */
  async execute(token, expiresAt) {
    if (!token) {
      throw new Error('Token required');
    }

    await this.tokenBlacklistRepository.blacklist(token, expiresAt, 'logout');
    return true;
  }
}

module.exports = LogoutUserUseCase;
