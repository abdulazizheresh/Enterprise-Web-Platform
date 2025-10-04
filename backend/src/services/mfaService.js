const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const logger = require('../utils/logger');

class MFAService {
    generateSecret(userEmail) {
        return speakeasy.generateSecret({
            name: `Enterprise Platform (${userEmail})`,
            issuer: 'Enterprise Platform',
            length: 32
        });
    }

    async generateQRCode(secret) {
        try {
            return await qrcode.toDataURL(secret.otpauth_url);
        } catch (error) {
            logger.error('QR code generation failed:', error);
            throw error;
        }
    }

    verifyToken(secret, token) {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2
        });
    }

    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
        }
        return codes;
    }
}

module.exports = new MFAService();