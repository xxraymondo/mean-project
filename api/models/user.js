// models/user.js
const mongoose = require('mongoose');
const constants = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String }, // For storing tokens (e.g., Google login token)
  passwordResetToken: { type: String }, // Field to store the password reset token
  passwordResetExpires: { type: Date }, // Field to store the password reset token's expiration time
  gender: { type: String }, // 'male', 'female', 'other', etc.
  address1: { type: String },
  address2: { type: String },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  isAdmin: { type: Boolean, default: false }, // For admin rank
  isSuperAdmin: { type: Boolean, default: false }, // For super-admin rank
  userRole: { type: String, default: constants.Roles.customer},
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart'},
  // Add any other user-related fields here, e.g., userImage, cart, orders, etc.
  // ...
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
