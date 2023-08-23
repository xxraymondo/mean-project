const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const nodemailer = require('nodemailer');
const constants = require('../utils/constants');


const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// Helper function to validate the new password
const isValidPassword = (password) => {
  // Add your password validation logic here, e.g., check minimum length, complexity, etc.
  return password.length >= 6;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    await userService.registerUser(name, email, password);
    return res.status(201).send({ success: true, message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).json({ success: true, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = loginUserSchema.parse(req.body);
    const user = await userService.loginUser(email, password);
    const token = jwt.sign({ userId: user._id, userRole: user.userRole, cartId: user.cartId}, process.env.JWT_SECRET/*, { expiresIn: '1h' }*/);
    return res.status(200).json({ success: true, message: 'Login successful', token, user: { name: user.name } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    await userService.logoutUser(req.user.userId);
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging out' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Check if the user exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique password reset token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Save the token and its expiration time in the user's document in the database
    await userService.savePasswordResetToken(email, token);

    // Send the password reset email containing the reset link with the token as a query parameter
    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Verify the token and get the associated email
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    // Validate the new password
    if (!isValidPassword(password)) {
      throw new Error('Invalid password');
    }

    // Reset the user's password in the database
    await userService.resetUserPassword(email, password);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Nodemailer function to send the password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    // Create a Nodemailer transporter using SMTP with your personal email credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: 'teamcodemaster@gmail.com', // Replace with your Gmail email address
        pass: 'qxtgcdlaxzkhdnin', // Replace with your Gmail email password or app-specific password
      },
    });

    const mailOptions = {
      from: 'teamcodemaster@gmail.com', // Replace with your email address
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${process.env.APP_FRONT}/reset-password.html?token=${token}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

const getNumberOfActiveUsers = async (req, res)=>{
 let response = await userService.getNumberOfActiveUsers(req.query);
 res.status(response.status??200).send(response);
}

const getUsers = async (req, res)=>{
  let response = await userService.getUsers(req.user.userId);
  res.status(response.status??200).send(response);
}

const updateUserRole = async(req, res)=>{
  let body = req.body;
  if(!body.role || !constants.Roles[body.role]||!body.userId){
    res.status(400).send({success: false, message:"Bad request."});
    return;
  }
  let response = await userService.updateUserRole(body.role, body.userId);
  res.status(response.status??200).send(response);
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getNumberOfActiveUsers,
  getUsers,
  updateUserRole
};
