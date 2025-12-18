import AuthError from '../../../../src/model/errors/authError';
import ValidationError from '../../../../src/model/errors/validationError';
import RepositoryError from '../../../../src/model/errors/repositoryError';

describe('Custom Error Classes', () => {
  describe('AuthError', () => {
    it('should create auth error', () => {
      const error = new AuthError('Invalid credentials');

      expect(error.message).toBe('Invalid credentials');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct prototype', () => {
      const error = new AuthError('Test');
      expect(error instanceof AuthError).toBe(true);
    });

    it('should include stack trace', () => {
      const error = new AuthError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid email');

      expect(error.message).toBe('Invalid email');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct prototype', () => {
      const error = new ValidationError('Test');
      expect(error instanceof ValidationError).toBe(true);
    });

    it('should include stack trace', () => {
      const error = new ValidationError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('RepositoryError', () => {
    it('should create repository error', () => {
      const error = new RepositoryError('Database connection failed');

      expect(error.message).toBe('Database connection failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct prototype', () => {
      const error = new RepositoryError('Test');
      expect(error instanceof RepositoryError).toBe(true);
    });

    it('should include stack trace', () => {
      const error = new RepositoryError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw and catch AuthError', () => {
      const throwError = () => {
        throw new AuthError('Auth failed');
      };

      expect(throwError).toThrow(AuthError);
    });

    it('should throw and catch ValidationError', () => {
      const throwError = () => {
        throw new ValidationError('Invalid data');
      };

      expect(throwError).toThrow(ValidationError);
    });

    it('should throw and catch RepositoryError', () => {
      const throwError = () => {
        throw new RepositoryError('DB error');
      };

      expect(throwError).toThrow(RepositoryError);
    });

    it('should distinguish different error types in array', () => {
      const errors = [
        new AuthError('Auth'),
        new ValidationError('Validation'),
        new RepositoryError('Repository'),
      ];

      const authErrors = errors.filter((e) => e instanceof AuthError);
      const valErrors = errors.filter((e) => e instanceof ValidationError);
      const repoErrors = errors.filter((e) => e instanceof RepositoryError);

      expect(authErrors).toHaveLength(1);
      expect(valErrors).toHaveLength(1);
      expect(repoErrors).toHaveLength(1);
    });
  });

  describe('Error Messages', () => {
    it('should preserve custom error messages', () => {
      const messages = [
        'Custom auth message',
        'Custom validation message',
        'Custom repository message',
      ];

      const authError = new AuthError(messages[0]);
      const valError = new ValidationError(messages[1]);
      const repoError = new RepositoryError(messages[2]);

      expect(authError.message).toBe(messages[0]);
      expect(valError.message).toBe(messages[1]);
      expect(repoError.message).toBe(messages[2]);
    });
  });
});
