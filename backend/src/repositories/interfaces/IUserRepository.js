/**
 * Repository Interface for User
 * Defines the contract for user data access
 */
class IUserRepository {
  /**
   * Creates a new user
   * @param {UserDTO} dto - The user data
   * @returns {Promise<UserDTO>}
   */
  async create(dto) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a user by ID
   * @param {number} id - The user ID
   * @returns {Promise<UserDTO|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a user by email
   * @param {string} email - The email
   * @returns {Promise<UserDTO|null>}
   */
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a user by Google ID
   * @param {string} googleId - The Google ID
   * @returns {Promise<UserDTO|null>}
   */
  async findByGoogleId(googleId) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds all users with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<{data: UserDTO[], total: number}>}
   */
  async findAll(options) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a user
   * @param {number} id - The user ID
   * @param {Object} data - The update data
   * @returns {Promise<UserDTO>}
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a user (soft delete)
   * @param {number} id - The user ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Searches users by email or name
   * @param {string} searchTerm - Search term
   * @returns {Promise<UserDTO[]>}
   */
  async search(searchTerm) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates user password
   * @param {number} id - The user ID
   * @param {string} newPassword - The new password
   * @returns {Promise<UserDTO>}
   */
  async updatePassword(id, newPassword) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates user last login timestamp
   * @param {number} id - The user ID
   * @returns {Promise<UserDTO>}
   */
  async updateLastLogin(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IUserRepository;
