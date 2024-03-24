const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: { type: String, required: true, default: 'user' }, // Define the role of the user, default to 'user'
  isVerified: { type: Boolean, default: false }, // Track whether the user has verified their email
  verificationToken: { type: String } // Used for email verification process
});

const User = mongoose.model('User', userSchema);

module.exports = User;