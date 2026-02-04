import { Router, Request, Response } from 'express';
import { sendContactSupportEmail } from '@/utils/emailService';
import logger from '@/config/logger';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @swagger
 * /api/contact-support:
 *   post:
 *     summary: Submit contact support form (sends email to support)
 *     tags: [Contact Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to send email
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : undefined;

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      });
    }
    if (!trimmedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }
    if (!trimmedSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required.',
      });
    }
    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }
    if (trimmedMessage.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long.',
      });
    }

    const sent = await sendContactSupportEmail({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    if (!sent) {
      logger.error('Contact support email failed to send', {
        email: trimmedEmail,
        name: trimmedName,
      });
      return res.status(500).json({
        success: false,
        message: 'We could not send your message. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent. We will get back to you as soon as possible.',
    });
  } catch (error) {
    logger.error('Contact support error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
