/**
 * Token Blacklist Repository Interface
 */
class ITokenBlacklistRepository {
  /**
   * Adds a token to the blacklist
   * @param {string} token - The token to blacklist
   * @param {Date} expiresAt - When the token expires
   * @param {string} reason - Reason for blacklisting
   * @returns {Promise<boolean>}
   */
  async blacklist(token, expiresAt, reason) {
    throw new Error('Method not implemented');
  }

  /**
   * Checks if a token is blacklisted
   * @param {string} token - The token to check
   * @returns {Promise<boolean>}
   */
  async isBlacklisted(token) {
    throw new Error('Method not implemented');
  }

  /**
   * Cleans up expired tokens from the blacklist
   * @returns {Promise<number>} Number of tokens deleted
   */
  async cleanupExpired() {
    throw new Error('Method not implemented');
  }
}

module.exports = ITokenBlacklistRepository;
