// routes/auth.js
const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/authController')
const userController = require('../controllers/userController');
const { authenticateToken } = require('../utils/authorization');
const authorization = require('../utils/authorization');
const constants = require('../utils/constants');

router.post('/google-login', googleLogin);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser); // Ensure authentication middleware is applied
router.post('/forgot-password', userController.forgotPassword); // New endpoint for password reset request
router.post('/reset-password', userController.resetPassword); // New endpoint for resetting the password
router.get('/active-users', 
    authorization.verifyAccess(constants.Actions.getActiveUsers), 
    userController.getNumberOfActiveUsers);
router.get('/users', 
    authorization.verifyAccess(constants.Actions.getActiveUsers), 
    userController.getUsers);
router.put('/users', authorization.verifyAccess(constants.Actions.updateUser), userController.updateUserRole);
module.exports = router;
