/**
 * Data Transfer Object for Mass Intention
 * Encapsulates request/response data and provides validation
 */
class MassIntentionDTO {
  constructor({
    id,
    type,
    intentionDetails,
    donorName,
    parishId,
    massSchedule,
    preferredPriest,
    notes,
    dateRequested,
    status,
    submittedBy,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.type = type;
    this.intentionDetails = intentionDetails;
    this.donorName = donorName;
    this.parishId = parishId;
    this.massSchedule = massSchedule;
    this.preferredPriest = preferredPriest;
    this.notes = notes;
    this.dateRequested = dateRequested;
    this.status = status;
    this.submittedBy = submittedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates DTO from request body
   */
  static fromRequest(body) {
    return new this({
      type: body.type,
      intentionDetails: body.intentionDetails,
      donorName: body.donorName,
      parishId: parseInt(body.parishId),
      massSchedule: new Date(body.massSchedule),
      preferredPriest: body.preferredPriest,
      notes: body.notes,
    });
  }

  /**
   * Creates DTO from database entity
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return new this({
      id: entity.id,
      type: entity.type,
      intentionDetails: entity.intentionDetails,
      donorName: entity.donorName,
      parishId: entity.parishId,
      massSchedule: entity.massSchedule,
      preferredPriest: entity.preferredPriest,
      notes: entity.notes,
      dateRequested: entity.dateRequested,
      status: entity.status,
      submittedBy: entity.submittedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Creates DTOs from database entities
   */
  static fromEntities(entities) {
    return entities.map(entity => this.fromEntity(entity));
  }

  /**
   * Validates the DTO data
   */
  validate() {
    const errors = [];

    if (!this.type || !['For the Dead', 'Thanksgiving', 'Special Intention'].includes(this.type)) {
      errors.push('Invalid or missing intention type');
    }

    if (!this.intentionDetails || typeof this.intentionDetails !== 'string') {
      errors.push('Intention details are required');
    }

    if (!this.donorName || typeof this.donorName !== 'string') {
      errors.push('Donor name is required');
    }

    if (!this.parishId || typeof this.parishId !== 'number') {
      errors.push('Valid parish ID is required');
    }

    if (!this.massSchedule || !(this.massSchedule instanceof Date) || isNaN(this.massSchedule.getTime())) {
      errors.push('Valid mass schedule date is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Returns only allowed update fields
   */
  getAllowedUpdates(allowedFields) {
    const updateData = {};
    for (const field of allowedFields) {
      if (this[field] !== undefined) {
        updateData[field] = this[field];
      }
    }
    return updateData;
  }

  /**
   * Converts to plain object
   */
  toObject() {
    return {
      id: this.id,
      type: this.type,
      intentionDetails: this.intentionDetails,
      donorName: this.donorName,
      parishId: this.parishId,
      massSchedule: this.massSchedule,
      preferredPriest: this.preferredPriest,
      notes: this.notes,
      dateRequested: this.dateRequested,
      status: this.status,
      submittedBy: this.submittedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = MassIntentionDTO;
