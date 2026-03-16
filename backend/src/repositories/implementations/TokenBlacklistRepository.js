/**
 * TokenBlacklist Repository Implementation
 */
const { TokenBlacklist } = require('../../models');

class TokenBlacklistRepository {
  /**
   * Adds a token to the blacklist
   */
  async blacklist(token, expiresAt, reason = 'logout') {
    await TokenBlacklist.blacklist(token, expiresAt, reason);
    return true;
  }

  /**
   * Checks if a token is blacklisted
   */
  async isBlacklisted(token) {
    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    return !!blacklisted;
  }

  /**
   * Cleans up expired tokens from the blacklist
   */
  async cleanupExpired() {
    const deletedCount = await TokenBlacklist.cleanupExpired();
    return deletedCount;
  }
}

module.exports = TokenBlacklistRepository;
