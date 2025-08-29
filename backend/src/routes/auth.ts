import { Router } from 'express';
import { authService } from '../services/auth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
      });
    }

    const result = await authService.signUp({
      email,
      password,
      fullName,
      phone,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const result = await authService.signIn({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Signin error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Sign out
router.post('/signout', authenticateToken, async (req, res) => {
  try {
    const result = await authService.signOut();
    res.json(result);
  } catch (error) {
    logger.error('Signout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const result = await authService.resetPassword(email);
    res.json(result);
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update password
router.put('/update-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password is required',
      });
    }

    const result = await authService.updatePassword(newPassword);
    res.json(result);
  } catch (error) {
    logger.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// OAuth sign in
router.post('/oauth/:provider', async (req, res) => {
  try {
    const { provider } = req.params;

    if (!['google', 'github', 'facebook'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OAuth provider',
      });
    }

    const result = await authService.signInWithOAuth(provider as 'google' | 'github' | 'facebook');
    res.json(result);
  } catch (error) {
    logger.error('OAuth signin error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const result = await authService.handleOAuthCallback();
    
    if (result.success) {
      // Redirect to frontend with success
      res.redirect(`${process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000'}/auth/success`);
    } else {
      // Redirect to frontend with error
      res.redirect(`${process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000'}/auth/error`);
    }
  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.redirect(`${process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000'}/auth/error`);
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { fullName, phone, avatarUrl } = req.body;
    const userId = req.user!.id;

    const updates: Record<string, any> = {};
    if (fullName !== undefined) updates.full_name = fullName;
    if (phone !== undefined) updates.phone = phone;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    const result = await authService.updateProfile(userId, updates);
    res.json(result);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
