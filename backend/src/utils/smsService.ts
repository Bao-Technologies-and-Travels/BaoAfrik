import twilio from 'twilio';
import logger from '@/config/logger';

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    logger.warn('Twilio credentials not configured. SMS sending will be disabled.');
    return null;
  }

  return twilio(accountSid, authToken);
};

/**
 * Send OTP via SMS using Twilio
 */
export const sendOTP = async (phoneNumber: string, code: string): Promise<void> => {
  const client = getTwilioClient();

  if (!client) {
    logger.error('Twilio client not initialized. Cannot send SMS.');
    throw new Error('SMS service not configured');
  }

  const message = `Your OTP for BaoAfrik two-step verification is: ${code}`;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: fromNumber!,
      to: phoneNumber
    });

    logger.info('OTP sent successfully via Twilio', {
      to: phoneNumber,
      messageSid: messageResponse.sid
    });
  } catch (error: any) {
    logger.error('Failed to send OTP via Twilio', {
      error: error.message,
      phoneNumber: phoneNumber
    });
    throw new Error('Failed to send verification code. Please try again.');
  }
};
