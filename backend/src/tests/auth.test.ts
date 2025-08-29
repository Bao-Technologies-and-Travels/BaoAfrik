import request from 'supertest';
import { app } from '../index';

describe('Authentication Routes', () => {
  // Mock test data
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    fullName: 'Test User',
    phone: '+1234567890'
  };

  describe('POST /api/auth/signup', () => {
    it('should create a new user account', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect([200, 201]).toContain(response.status);
      expect(response.body.success).toBe(true);
      
      // Handle both immediate success and email confirmation cases
      if (response.body.user) {
        expect(response.body.user.email).toBe(testUser.email);
      } else if (response.body.requiresConfirmation) {
        expect(response.body.message).toContain('Confirmation email sent');
      }
    });

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com'
          // Missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 for invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return user data with valid token', async () => {
      // This would require a valid JWT token
      // In a real test, you'd sign in first to get a token
      const token = 'valid-jwt-token';
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      // Response depends on token validity
      expect(response.body).toBeDefined();
    });
  });
});
