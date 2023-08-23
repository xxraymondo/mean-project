// utils/authentication.js new name authorization.js
const jwt = require('jsonwebtoken');
const constants = require('./constants');
const GOOGLE_CLIENT_SECRET = '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';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};
const checkAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  };
const checkSuperAdmin = (req, res, next) => {
    if (req.user.isSuperAdmin) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  };
  
 
const verifyAccess = (action)=> (req, res, next) =>{
  if (!verifyToken(req, res)) return;
  if (!checkAuthorization(req, res, action)) return;
  next();
}

function verifyToken(req, res, options = { isAccessToken: true }) {
  if(!req.headers.authorization){
    res.status(401).send({ success: false, message: "Unauthorized" });
    return false;
  }
  const token = req.headers.authorization.split(' ')[1];
  let { isAccessToken } = options;
  if (!token) {
    res.status(401).send({ success: false, message: "Unauthorized" });
    return false;
  }
  let result = false;
  let key = isAccessToken ? process.env.JWT_SECRET : process.env.REFRESH_TOKEN;
  jwt.verify(
    token,
    key,
    (err, userInfo) => {
      if (err) {
        res.status(401).send({ success: false, message: isAccessToken ? "Invalid Token" : "Invalid token" });
        return false;
      }
      req.user = userInfo;
      req.token = token;
      result = true;
    });
  return result;
}

function checkAuthorization(req, res, action){
  if(req.user.userRole == constants.Roles.superAdmin) return true;
  let userRoleActions = constants.AllowedActions[req.user.userRole];
  if(!userRoleActions.includes(action)){
    res.status(401).send({ success: false, message:"Your are not authorized to access this resource." });
    return false;
  }
  return true;
}


const generateAccessToken = (user) => {
  // Create a JWT token with user information
  return jwt.sign(
    { userId: user._id, userRole: user.userRole, cartId: user.cartId },
    process.env.JWT_SECRET,
    // Add any additional options as needed, e.g., expiresIn: '1h'
  );
};

const loginUserWithGoogle = async (req, res) => {
  try {
    const { id_token } = req.body;

    // Verify the Google ID token
    const { sub: googleUserId, email, email_verified } = await verifyGoogleIdToken(id_token);

    // Check if the email is verified
    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified by Google' });
    }

    // Here, you might want to check if the user with this email exists in your database
    // If not, you might create a new user record

    // Generate an access token using JWT
    const accessToken = generateAccessToken(googleUserId, constants.Roles.user);

    return res.status(200).json({ message: 'Login with Google successful', accessToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};





module.exports = {
  authenticateToken,
  checkAdmin,
  checkSuperAdmin,
  verifyAccess,
  generateAccessToken,
  loginUserWithGoogle
};