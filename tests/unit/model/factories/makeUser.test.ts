import { makeUser } from '../../../../src/model/factories/makeUser';

describe('makeUser Factory', () => {
  describe('Create User', () => {
    it('should create a valid patient', () => {
      const user = makeUser({
        id: 'user-1',
        name: 'João Silva',
        email: 'joao@example.com',
        role: 'patient',
      });

      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@example.com');
      expect(user.role).toBe('patient');
      expect(user.id).toBe('user-1');
    });

    it('should create a valid nutritionist', () => {
      const user = makeUser({
        id: 'nutri-1',
        name: 'Dra. Maria',
        email: 'maria@example.com',
        role: 'nutritionist',
      });

      expect(user.name).toBe('Dra. Maria');
      expect(user.email).toBe('maria@example.com');
      expect(user.role).toBe('nutritionist');
    });

    it('should generate id when not provided', () => {
      const user = makeUser({
        name: 'João Silva',
        email: 'joao@example.com',
        role: 'patient',
      });

      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0);
    });
  });

  describe('Data Integrity', () => {
    it('should preserve all user properties', () => {
      const userData = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'patient' as const,
      };

      const user = makeUser(userData);

      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should support both patient and nutritionist roles', () => {
      const patient = makeUser({
        id: 'p1',
        name: 'Patient',
        email: 'p@example.com',
        role: 'patient',
      });

      const nutritionist = makeUser({
        id: 'n1',
        name: 'Nutritionist',
        email: 'n@example.com',
        role: 'nutritionist',
      });

      expect(patient.role).toBe('patient');
      expect(nutritionist.role).toBe('nutritionist');
    });
  });

  describe('Type Safety', () => {
    it('should enforce User interface contract', () => {
      const user = makeUser({
        id: 'test-id',
        name: 'Test',
        email: 'test@example.com',
        role: 'patient',
      });

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('createdAt');
    });
  });
});
