/**
 * Repository Exports
 * Central export point for all repositories
 */

// Interfaces
const IMassIntentionRepository = require('./interfaces/IMassIntentionRepository');
const IParishRepository = require('./interfaces/IParishRepository');

// Implementations
const MassIntentionRepository = require('./implementations/MassIntentionRepository');
const ParishRepository = require('./implementations/ParishRepository');

module.exports = {
  // Interfaces (for type checking / documentation)
  IMassIntentionRepository,
  IParishRepository,
  
  // Implementations
  MassIntentionRepository,
  ParishRepository,
};
