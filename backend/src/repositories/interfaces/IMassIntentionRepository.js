/**
 * Repository Interface for Mass Intention
 * Defines the contract for mass intention data access
 */
class IMassIntentionRepository {
  /**
   * Creates a new mass intention
   * @param {MassIntentionDTO} dto - The mass intention data
   * @returns {Promise<MassIntentionDTO>}
   */
  async create(dto) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a mass intention by ID
   * @param {number} id - The mass intention ID
   * @returns {Promise<MassIntentionDTO|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds all mass intentions with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<{data: MassIntentionDTO[], total: number}>}
   */
  async findAll(options) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a mass intention
   * @param {number} id - The mass intention ID
   * @param {Object} data - The update data
   * @returns {Promise<MassIntentionDTO>}
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a mass intention
   * @param {number} id - The mass intention ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates the status of a mass intention
   * @param {number} id - The mass intention ID
   * @param {string} status - The new status
   * @returns {Promise<MassIntentionDTO>}
   */
  async updateStatus(id, status) {
    throw new Error('Method not implemented');
  }
}

module.exports = IMassIntentionRepository;
