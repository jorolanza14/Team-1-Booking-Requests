/**
 * Data Transfer Object for Booking
 * Encapsulates booking data and provides validation
 */
class BookingDTO {
  constructor({
    id,
    userId,
    parishId,
    bookingType,
    requestedDate,
    status,
    notes,
    documents,
    additionalInfo,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.parishId = parishId;
    this.bookingType = bookingType;
    this.requestedDate = requestedDate;
    this.status = status;
    this.notes = notes;
    this.documents = documents || [];
    this.additionalInfo = additionalInfo || {};
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates DTO from request body
   */
  static fromRequest(body) {
    return new this({
      userId: body.userId,
      parishId: parseInt(body.parishId),
      bookingType: body.bookingType,
      requestedDate: new Date(body.requestedDate),
      status: body.status || 'pending',
      notes: body.notes,
      documents: body.documents || [],
      additionalInfo: body.additionalInfo || {},
    });
  }

  /**
   * Creates DTO from database entity
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return new this({
      id: entity.id,
      userId: entity.userId,
      parishId: entity.parishId,
      bookingType: entity.bookingType,
      requestedDate: entity.requestedDate,
      status: entity.status,
      notes: entity.notes,
      documents: entity.documents,
      additionalInfo: entity.additionalInfo,
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
   * Validates booking data
   */
  validate() {
    const errors = [];

    if (!this.userId || typeof this.userId !== 'number') {
      errors.push('Valid user ID is required');
    }

    if (!this.parishId || typeof this.parishId !== 'number') {
      errors.push('Valid parish ID is required');
    }

    const validTypes = ['baptism', 'wedding', 'confirmation', 'baptism_request', 'wedding_request', 'confirmation_request'];
    if (!this.bookingType || !validTypes.includes(this.bookingType)) {
      errors.push('Valid booking type is required');
    }

    if (!this.requestedDate || !(this.requestedDate instanceof Date) || isNaN(this.requestedDate.getTime())) {
      errors.push('Valid requested date is required');
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (this.status && !validStatuses.includes(this.status)) {
      errors.push('Invalid status');
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
      userId: this.userId,
      parishId: this.parishId,
      bookingType: this.bookingType,
      requestedDate: this.requestedDate,
      status: this.status,
      notes: this.notes,
      documents: this.documents,
      additionalInfo: this.additionalInfo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = BookingDTO;
