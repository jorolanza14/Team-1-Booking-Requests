/**
 * Unit Tests for UserDTO
 */
const UserDTO = require('../../dto/UserDTO');

describe('UserDTO', () => {
  describe('fromRegisterRequest', () => {
    it('should create DTO from registration request', () => {
      const body = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '09171234567',
        role: 'parishioner',
      };

      const dto = UserDTO.fromRegisterRequest(body);

      expect(dto.email).toBe('test@example.com');
      expect(dto.password).toBe('password123');
      expect(dto.firstName).toBe('John');
      expect(dto.role).toBe('parishioner');
    });
  });

  describe('validateForRegistration', () => {
    it('should return valid for complete data', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'parishioner',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing email', () => {
      const dto = new UserDTO({
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    it('should return invalid for invalid email format', () => {
      const dto = new UserDTO({
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    it('should return invalid for short password', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should return invalid for missing first name', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
        lastName: 'Doe',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('First name is required');
    });

    it('should return invalid for missing last name', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Last name is required');
    });

    it('should return invalid for invalid role', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'invalid_role',
      });

      const result = dto.validateForRegistration();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid role');
    });
  });

  describe('validateForLogin', () => {
    it('should return valid for complete credentials', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
        password: 'password123',
      });

      const result = dto.validateForLogin();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing email', () => {
      const dto = new UserDTO({
        password: 'password123',
      });

      const result = dto.validateForLogin();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    it('should return invalid for missing password', () => {
      const dto = new UserDTO({
        email: 'test@example.com',
      });

      const result = dto.validateForLogin();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });
  });

  describe('toSafeObject', () => {
    it('should return user object without sensitive data', () => {
      const dto = new UserDTO({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '09171234567',
        role: 'parishioner',
        assignedParishId: 5,
        googleId: 'google123',
        isActive: true,
      });

      const safe = dto.toSafeObject();

      expect(safe).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '09171234567',
        role: 'parishioner',
        assignedParishId: 5,
        isActive: true,
        createdAt: undefined,
        updatedAt: undefined,
      });
      expect(safe.password).toBeUndefined();
      expect(safe.googleId).toBeUndefined();
    });
  });

  describe('fromEntity', () => {
    it('should create DTO from database entity', () => {
      const entity = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '09171234567',
        role: 'parish_admin',
        assignedParishId: 3,
        googleId: null,
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = UserDTO.fromEntity(entity);

      expect(dto.id).toBe(1);
      expect(dto.email).toBe('test@example.com');
      expect(dto.role).toBe('parish_admin');
    });

    it('should return null for null entity', () => {
      const dto = UserDTO.fromEntity(null);
      expect(dto).toBeNull();
    });
  });
});
