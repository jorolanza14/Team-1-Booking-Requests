/**
 * Token Service Interface
 * Defines the contract for JWT token operations
 */
class ITokenService {
  /**
   * Generates access and refresh tokens for a user
   * @param {UserDTO} user - The user data
   * @returns {{accessToken: string, refreshToken: string}}
   */
  generateTokens(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Generates only an access token
   * @param {UserDTO} user - The user data
   * @returns {string}
   */
  generateAccessToken(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Verifies an access token
   * @param {string} token - The access token
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    throw new Error('Method not implemented');
  }

  /**
   * Verifies a refresh token
   * @param {string} token - The refresh token
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITokenService;
