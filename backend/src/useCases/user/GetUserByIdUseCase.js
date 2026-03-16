/**
 * Use Case: Get user by ID
 */
class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, user) {
    // Check permission (users can only view themselves unless admin)
    if (user.userId !== id && !this._isAdmin(user.role)) {
      throw new Error('Access denied');
    }

    const foundUser = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new Error('User not found');
    }

    return foundUser.toSafeObject();
  }

  _isAdmin(role) {
    return ['diocese_staff', 'diocese_admin'].includes(role);
  }
}

module.exports = GetUserByIdUseCase;
