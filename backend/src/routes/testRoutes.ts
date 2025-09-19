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
    
    const emailSent = await sendVerificationEmail(email, name, verificationCode);
    
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

export default router;
