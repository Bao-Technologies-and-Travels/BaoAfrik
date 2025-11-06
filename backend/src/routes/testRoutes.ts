import { Router, Request, Response } from 'express';
import { testEmailConnection, sendVerificationEmail } from '@/utils/emailService';
import logger from '@/config/logger';

const router = Router();

/**
 * @swagger
 * /api/test/email-connection:
 *   get:
 *     summary: Test email service connection
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Email connection test result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get('/email-connection', async (req: Request, res: Response) => {
  try {
    const isConnected = await testEmailConnection();
    
    res.json({
      success: isConnected,
      message: isConnected 
        ? 'Email service connection successful' 
        : 'Email service connection failed'
    });
  } catch (error) {
    logger.error('Email connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/test/send-email:
 *   post:
 *     summary: Send test email
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to send email
 */
router.post('/send-email', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }
    
    // Generate a test verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    if (emailSent) {
      return res.json({
        success: true,
        message: 'Test verification email sent successfully',
        verificationCode: verificationCode // Only for testing purposes
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
  } catch (error) {
    logger.error('Send test email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/test/get-verification-code:
 *   post:
 *     summary: Get verification code for testing (Development only)
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code retrieved
 *       404:
 *         description: User not found
 */
router.post('/get-verification-code', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Import prisma here to avoid circular dependencies
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        emailVerificationCode: true,
        emailVerificationExpires: true,
        emailVerified: true
      }
    });

    await prisma.$disconnect();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Verification code retrieved (Development only)',
      data: {
        email: user.email,
        verificationCode: user.emailVerificationCode,
        expiresAt: user.emailVerificationExpires,
        isVerified: user.emailVerified
      }
    });
  } catch (error) {
    logger.error('Get verification code error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get verification code',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test email sending
router.post('/send-test-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Import email service
    const emailService = await import('../utils/emailService');
    
    // Send test email using the sendEmail method
    await emailService.default.sendEmail({
      to: email,
      subject: 'BaoAfrik Email Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F9A825;">🎉 Email Service Test Successful!</h2>
          <p>Hello from BaoAfrik!</p>
          <p>This is a test email to confirm that your email service is working correctly.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">✅ Email Configuration Status:</h3>
            <ul style="color: #666;">
              <li>SMTP Connection: Active</li>
              <li>Gmail App Password: Working</li>
              <li>Email Delivery: Successful</li>
            </ul>
          </div>
          <p style="color: #666;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: BaoAfrik Team
          </p>
        </div>
      `
    });

    logger.info(`Test email sent successfully to ${email}`);
    
    return res.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
        }),
    });
    
  } catch (error) {
    logger.error('Send test email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
