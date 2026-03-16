/**
 * Use Case Exports
 * Central export point for all use cases
 */

// Mass Intention Use Cases
const CreateMassIntentionUseCase = require('./massIntention/CreateMassIntentionUseCase');
const GetAllMassIntentionsUseCase = require('./massIntention/GetAllMassIntentionsUseCase');
const GetMassIntentionByIdUseCase = require('./massIntention/GetMassIntentionByIdUseCase');
const UpdateMassIntentionUseCase = require('./massIntention/UpdateMassIntentionUseCase');
const DeleteMassIntentionUseCase = require('./massIntention/DeleteMassIntentionUseCase');
const ApproveMassIntentionUseCase = require('./massIntention/ApproveMassIntentionUseCase');
const DeclineMassIntentionUseCase = require('./massIntention/DeclineMassIntentionUseCase');

module.exports = {
  // Mass Intention Use Cases
  CreateMassIntentionUseCase,
  GetAllMassIntentionsUseCase,
  GetMassIntentionByIdUseCase,
  UpdateMassIntentionUseCase,
  DeleteMassIntentionUseCase,
  ApproveMassIntentionUseCase,
  DeclineMassIntentionUseCase,
};
