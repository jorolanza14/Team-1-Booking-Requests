/**
 * Use Case: Update user (Admin or self)
 */
const UserDTO = require('../../dto/UserDTO');

class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, dto, user) {
    // Check permission
    if (user.userId !== id && !['diocese_staff', 'diocese_admin'].includes(user.role)) {
      throw new Error('Access denied');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check email uniqueness if changing email
    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new Error('Email already registered');
      }
    }

    // Get allowed fields based on role
    const allowedFields = this._getAllowedFields(user.role, user.userId === id);
    const updateData = dto.getAllowedUpdates(allowedFields);

    return await this.userRepository.update(id, updateData);
  }

  _getAllowedFields(role, isSelf) {
    if (['diocese_staff', 'diocese_admin'].includes(role)) {
      return ['email', 'firstName', 'lastName', 'phone', 'role', 'assignedParishId', 'isActive'];
    }
    
    // Self-update limited fields
    return ['firstName', 'lastName', 'phone'];
  }
}

module.exports = UpdateUserUseCase;
