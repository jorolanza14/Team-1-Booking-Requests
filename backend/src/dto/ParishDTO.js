/**
 * Data Transfer Object for Parish
 */
class ParishDTO {
  constructor({
    id,
    name,
    address,
    contactEmail,
    contactPhone,
    description,
    schedule,
    servicesOffered,
    imageUrl,
    isActive,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
    this.description = description;
    this.schedule = schedule;
    this.servicesOffered = servicesOffered;
    this.imageUrl = imageUrl;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Creates DTO from request body
   */
  static fromRequest(body) {
    return new this({
      name: body.name,
      address: body.address,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      description: body.description,
      schedule: body.schedule,
      servicesOffered: body.servicesOffered,
      imageUrl: body.imageUrl,
    });
  }

  /**
   * Creates DTO from database entity
   */
  static fromEntity(entity) {
    if (!entity) return null;
    return new this({
      id: entity.id,
      name: entity.name,
      address: entity.address,
      contactEmail: entity.contactEmail,
      contactPhone: entity.contactPhone,
      description: entity.description,
      schedule: entity.schedule,
      servicesOffered: entity.servicesOffered,
      imageUrl: entity.imageUrl,
      isActive: entity.isActive,
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
   * Validates parish data
   */
  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string') {
      errors.push('Name is required');
    }

    if (!this.address || typeof this.address !== 'string') {
      errors.push('Address is required');
    }

    if (this.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail)) {
      errors.push('Invalid email format');
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
      name: this.name,
      address: this.address,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      description: this.description,
      schedule: this.schedule,
      servicesOffered: this.servicesOffered,
      imageUrl: this.imageUrl,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = ParishDTO;
