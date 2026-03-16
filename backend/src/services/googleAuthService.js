const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { User } = require('../models');

class GoogleAuthService {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Google OAuth credentials not configured. Google login will not work.');
    }
  }

  /**
   * Verifies a Google ID token
   */
  async verifyGoogleToken(idToken) {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured');
    }

    const oAuth2Client = new OAuth2(
      this.clientId,
      this.clientSecret
    );

    try {
      const tokenInfo = await oAuth2Client.getTokenInfo(idToken);
      
      // Check if token is expired
      if (tokenInfo.expiry_date < Date.now()) {
        throw new Error('Expired Google token');
      }

      return {
        googleId: tokenInfo.sub,
        email: tokenInfo.email,
        firstName: tokenInfo.given_name,
        lastName: tokenInfo.family_name,
        picture: tokenInfo.picture,
        verified_email: tokenInfo.verified_email,
      };
    } catch (error) {
      if (error.message.includes('Invalid Value')) {
        throw new Error('Invalid Google token provided');
      }
      throw error;
    }
  }

  /**
   * Handles Google user authentication and creates/updates user record
   */
  async authenticateGoogleUser(googleUserInfo) {
    const { googleId, email, firstName, lastName, picture } = googleUserInfo;

    // Check if user already exists with this Google ID
    let user = await User.findOne({ where: { googleId } });

    if (user) {
      // User exists, update profile info if needed
      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        lastLoginAt: new Date(),
      });
    } else {
      // Check if user exists with this email but no Google ID
      user = await User.findOne({ where: { email } });
      
      if (user) {
        // Link Google account to existing email account
        await user.update({
          googleId,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          lastLoginAt: new Date(),
        });
      } else {
        // Create new user
        user = await User.create({
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          googleId,
          role: 'parishioner', // Default role
          isActive: true,
        });
      }
    }

    return user;
  }
}

module.exports = new GoogleAuthService();