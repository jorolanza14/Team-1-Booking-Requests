/**
 * Use Case: Delete user (soft delete - Admin only)
 */
class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, user) {
    // Check admin permission
    if (!['diocese_staff', 'diocese_admin'].includes(user.role)) {
      throw new Error('Access denied: Only admins can delete users');
    }

    // Prevent self-deletion
    if (user.userId === id) {
      throw new Error('Cannot delete your own account');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.userRepository.delete(id);
  }
}

module.exports = DeleteUserUseCase;
