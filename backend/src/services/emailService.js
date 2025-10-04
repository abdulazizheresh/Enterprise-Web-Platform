const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendWelcomeEmail(userEmail, userName) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: userEmail,
                subject: 'Welcome to Enterprise Platform',
                html: `
          <h2>Welcome ${userName}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now access all features of our platform.</p>
        `
            });
            logger.info(`Welcome email sent to ${userEmail}`);
        } catch (error) {
            logger.error('Email send failed:', error);
        }
    }

    async sendMFASetupEmail(userEmail, userName) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: userEmail,
                subject: 'MFA Setup Complete',
                html: `
          <h2>Hello ${userName}</h2>
          <p>Multi-Factor Authentication has been enabled on your account.</p>
          <p>Your account is now more secure!</p>
        `
            });
            logger.info(`MFA setup email sent to ${userEmail}`);
        } catch (error) {
            logger.error('MFA email send failed:', error);
        }
    }
}

module.exports = new EmailService();