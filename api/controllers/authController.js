const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userService = require('../services/userService');
const mongoose = require('mongoose');
const { generateAccessToken } = require('../utils/authorization'); 

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Handle Google login
const googleLogin = async (req, res) => {
    try {
      const { idToken } = req.body;
  
      // Verify Google ID token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
  
      // Check if the user exists
      let user = await mongoose.model('User').findOne({ email: payload.email });
  
      if (!user) {
        // Create a new user if not found
        user = await userService.registerUser(payload.name, payload.email, ''); // Provide an empty password here or adjust as needed
      }
  
      // Generate access token
      const accessToken = generateAccessToken(user);
  
      return res.status(200).json({ token: accessToken, user: { name: user.name } });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  


module.exports = {
  googleLogin,
  generateAccessToken,
};
