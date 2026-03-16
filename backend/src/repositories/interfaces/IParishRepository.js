/**
 * Repository Interface for Parish
 * Defines the contract for parish data access
 */
class IParishRepository {
  /**
   * Creates a new parish
   * @param {Object} data - The parish data
   * @returns {Promise<Object>}
   */
  async create(data) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a parish by ID
   * @param {number} id - The parish ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds all parishes with optional filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>}
   */
  async findAll(options) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a parish
   * @param {number} id - The parish ID
   * @param {Object} data - The update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a parish
   * @param {number} id - The parish ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Searches parishes by query
   * @param {string} query - Search query
   * @returns {Promise<Object[]>}
   */
  async search(query) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds parishes by service offered
   * @param {string} service - Service name
   * @returns {Promise<Object[]>}
   */
  async findByService(service) {
    throw new Error('Method not implemented');
  }
}

module.exports = IParishRepository;
