"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConnection = exports.sendWelcomeEmail = exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("@/config/logger"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_FROM_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        this.verifyConnection();
        if (process.env.EMAIL_SERVICE === 'sendgrid') {
            this.setupSendGrid();
        }
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info('SMTP connection verified successfully');
        }
        catch (error) {
            logger_1.default.error('SMTP connection verification failed:', error);
        }
    }
    setupSendGrid() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'SendGrid',
            auth: {
                user: 'apikey',
                pass: process.env.EMAIL_API_KEY,
            },
        });
    }
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: `${process.env.EMAIL_FROM_NAME || 'BaoAfrik Team'} <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger_1.default.info('Email sent successfully', {
                messageId: info.messageId,
                to: options.to,
                subject: options.subject,
            });
            return true;
        }
        catch (error) {
            logger_1.default.error('Failed to send email', {
                error: error instanceof Error ? error.message : 'Unknown error',
                to: options.to,
                subject: options.subject,
            });
            return false;
        }
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    getVerificationEmailTemplate(name, verificationCode) {
        const subject = 'Verify your BaoAfrik account';
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - BaoAfrik</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #F9A825; }
          .logo { font-size: 28px; font-weight: bold; color: #F9A825; }
          .content { padding: 30px 0; }
          .verification-code { 
            background: #f8f9fa; 
            border: 2px dashed #F9A825; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0;
            border-radius: 8px;
          }
          .code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #F9A825; 
            letter-spacing: 4px;
            font-family: monospace;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            background: #F9A825;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">BaoAfrik</div>
            <p>African Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Welcome to BaoAfrik, ${name}!</h2>
            
            <p>Thank you for joining our African marketplace community. To complete your registration and start exploring authentic African products, please verify your email address.</p>
            
            <div class="verification-code">
              <p><strong>Your verification code is:</strong></p>
              <div class="code">${verificationCode}</div>
            </div>
            
            <p>Enter this code in the verification page to activate your account. This code will expire in 10 minutes for security purposes.</p>
            
            <p>If you didn't create an account with BaoAfrik, you can safely ignore this email.</p>
            
            <p>Welcome to the BaoAfrik family!</p>
            
            <p>Best regards,<br>The BaoAfrik Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 BaoAfrik. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
      Welcome to BaoAfrik, ${name}!
      
      Thank you for joining our African marketplace community. To complete your registration, please verify your email address.
      
      Your verification code is: ${verificationCode}
      
      Enter this code in the verification page to activate your account. This code will expire in 10 minutes.
      
      If you didn't create an account with BaoAfrik, you can safely ignore this email.
      
      Best regards,
      The BaoAfrik Team
    `;
        return { subject, html, text };
    }
    getPasswordResetEmailTemplate(name, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const subject = 'Reset your BaoAfrik password';
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - BaoAfrik</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #F9A825; }
          .logo { font-size: 28px; font-weight: bold; color: #F9A825; }
          .content { padding: 30px 0; }
          .btn {
            display: inline-block;
            background: #F9A825;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">BaoAfrik</div>
            <p>African Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Password Reset Request</h2>
            
            <p>Hello ${name},</p>
            
            <p>We received a request to reset the password for your BaoAfrik account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security purposes. If you didn't request a password reset, you can safely ignore this email.
            </div>
            
            <p>If you continue to have problems, please contact our support team.</p>
            
            <p>Best regards,<br>The BaoAfrik Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 BaoAfrik. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
      Password Reset Request - BaoAfrik
      
      Hello ${name},
      
      We received a request to reset the password for your BaoAfrik account.
      
      If you made this request, click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for security purposes.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Best regards,
      The BaoAfrik Team
    `;
        return { subject, html, text };
    }
    async sendVerificationEmail(email, name, verificationCode) {
        const template = this.getVerificationEmailTemplate(name, verificationCode);
        return await this.sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async sendPasswordResetEmail(email, name, resetToken) {
        const template = this.getPasswordResetEmailTemplate(name, resetToken);
        return await this.sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    getWelcomeEmailTemplate(name) {
        const subject = 'Welcome to BaoAfrik - Your African Marketplace Journey Begins!';
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BaoAfrik</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #F9A825; }
          .logo { font-size: 28px; font-weight: bold; color: #F9A825; }
          .content { padding: 30px 0; }
          .feature-box {
            background: #f8f9fa;
            border-left: 4px solid #F9A825;
            padding: 15px;
            margin: 15px 0;
          }
          .btn {
            display: inline-block;
            background: #F9A825;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding: 20px 0; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">BaoAfrik</div>
            <p>African Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Welcome to BaoAfrik, ${name}! 🎉</h2>
            
            <p>Congratulations! Your account has been successfully verified and you're now part of the BaoAfrik community - Africa's premier online marketplace.</p>
            
            <div class="feature-box">
              <h3>🛍️ What you can do now:</h3>
              <ul>
                <li><strong>Browse Products:</strong> Discover authentic African products from verified sellers</li>
                <li><strong>List Your Products:</strong> Start selling your own products to our global community</li>
                <li><strong>Connect with Sellers:</strong> Message sellers directly for inquiries</li>
                <li><strong>Save Favorites:</strong> Bookmark products you love for later</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Explore BaoAfrik</a>
            </div>
            
            <div class="feature-box">
              <h3>🌍 Our Mission</h3>
              <p>BaoAfrik connects African entrepreneurs with global customers, promoting authentic African culture, crafts, and products while supporting local communities.</p>
            </div>
            
            <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this email or contact us through the platform.</p>
            
            <p>Thank you for joining our mission to showcase the best of Africa!</p>
            
            <p>Best regards,<br>The BaoAfrik Team</p>
          </div>
          
          <div class="footer">
            <p>Follow us on social media for updates and featured products!</p>
            <p>&copy; 2024 BaoAfrik. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
      Welcome to BaoAfrik, ${name}!
      
      Congratulations! Your account has been successfully verified and you're now part of the BaoAfrik community.
      
      What you can do now:
      - Browse authentic African products from verified sellers
      - List your own products to our global community
      - Connect with sellers directly
      - Save your favorite products
      
      Visit: ${process.env.FRONTEND_URL}/dashboard
      
      Our Mission: BaoAfrik connects African entrepreneurs with global customers, promoting authentic African culture while supporting local communities.
      
      Thank you for joining our mission to showcase the best of Africa!
      
      Best regards,
      The BaoAfrik Team
    `;
        return { subject, html, text };
    }
    async sendWelcomeEmail(email, name) {
        const template = this.getWelcomeEmailTemplate(name);
        return await this.sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
    async testEmailConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info('Email service connection test successful');
            return true;
        }
        catch (error) {
            logger_1.default.error('Email service connection test failed:', error);
            return false;
        }
    }
}
const emailService = new EmailService();
exports.sendVerificationEmail = emailService.sendVerificationEmail.bind(emailService);
exports.sendPasswordResetEmail = emailService.sendPasswordResetEmail.bind(emailService);
exports.sendWelcomeEmail = emailService.sendWelcomeEmail.bind(emailService);
exports.testEmailConnection = emailService.testEmailConnection.bind(emailService);
exports.default = emailService;
//# sourceMappingURL=emailService.js.map