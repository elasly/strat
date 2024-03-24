const express = require('express');
const User = require('../models/User');
const crypto = require('crypto'); // for generating password reset tokens
const nodemailer = require('nodemailer'); // for sending emails
const winston = require('winston');
const { backtestStrategy } = require('../services/backtestEngine');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // Added for rate limiting
const { hashPassword, comparePassword } = require('../services/hashService'); // Importing the new hash service
const { logPasswordMismatch } = require('../services/utils'); // Importing the logPasswordMismatch function

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // INPUT_REQUIRED {configure your email service provider}
  auth: {
    user: process.env.EMAIL_USERNAME, // INPUT_REQUIRED {configure your email username}
    pass: process.env.EMAIL_PASSWORD, // INPUT_REQUIRED {configure your email password}
  },
});

router.get('/auth/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Server-side password validation
    const passwordValidationRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!password.match(passwordValidationRegex)) {
      return res.render('register', { error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ username, password: hashedPassword, email, isVerified: false });
    const verificationToken = crypto.randomBytes(20).toString('hex');
    newUser.verificationToken = verificationToken;
    await newUser.save();

    const verificationUrl = `http://${process.env.HOST}/auth/verifyEmail?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Verify Your Email',
      text: `Please click on the following link to verify your email address: ${verificationUrl}`
    };

    await transporter.sendMail(mailOptions);
    res.redirect('/auth/login');
  } catch (error) {
    logger.error('Registration error: ' + error.message, { stack: error.stack });
    res.render('register', { error: error.message });
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.render('login', { error: 'User not found' });
      return;
    }
    const isMatch = await comparePassword(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      logger.info(`Login success for user: ${username}`);
      res.redirect('/');
    } else {
      logger.warn(`Login attempt failed for user: ${username}. Possible password mismatch. Attempt details have been securely logged.`);
      logPasswordMismatch(password, user.password, user._id.toString()); // Correctly added as per feedback
      res.render('login', { error: 'Password is incorrect' });
    }
  } catch (error) {
    logger.error('Login error: ' + error.message, { stack: error.stack });
    res.render('login', { error: 'An error occurred during login' });
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      logger.error('Error during session destruction: ' + err.message, { stack: err.stack });
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

router.post('/submitStrategy', async (req, res) => {
  try {
    logger.info("Received strategy submission:", req.body);
    const strategyDetails = {
      strategyName: req.body.strategyName,
      assetSymbol: req.body.assetSymbol,
      timeFrame: req.body.timeFrame,
      strategyRules: req.body.strategyRules,
      strategyType: req.body.strategyType
    };
    // Ensure strategy type is provided
    if (!strategyDetails.strategyType) {
      logger.error('Strategy submission error: Missing strategy type');
      return res.status(400).json({ error: "Missing strategy type" });
    }

    const backtestResults = await backtestStrategy(strategyDetails)
    .then(results => {
      logger.info("Backtesting complete, results:", results);
      res.json({message: "Strategy submitted and backtested successfully", results});
    })
    .catch(err => {
      logger.error('Error during backtesting: ' + err.message, { stack: err.stack });
      res.status(500).json({error: "Error during backtesting"});
    });
  } catch (error) {
    logger.error('Error during strategy submission: ' + error.message, { stack: error.stack });
    res.status(500).json({error: "Error submitting strategy"});
  }
});

// Password reset request route with rate limiting
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many password reset requests from this IP, please try again after 15 minutes'
});

router.get('/auth/passwordResetRequest', passwordResetLimiter, (req, res) => {
  res.render('passwordResetRequest');
});

router.post('/auth/passwordResetRequest', passwordResetLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.info('Password reset request for non-existent email: ' + email);
      return res.status(400).send('If an account with that email exists, a password reset link will be sent.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save().catch(err => {
      logger.error('Error saving user with password reset token: ' + err.message, { stack: err.stack });
      throw err;
    });

    const resetUrl = `http://${process.env.HOST}/auth/passwordReset/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Strategy Engine Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetUrl}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions).catch(err => {
      logger.error('Error sending password reset email: ' + err.message, { stack: err.stack });
      throw err; // Rethrow to be caught by the outer catch block
    });
    
    logger.info('Password reset email sent: ' + email);
    res.send('A password reset email has been sent.');
  } catch (error) {
    logger.error('Error sending password reset email: ' + error.message, { stack: error.stack });
    res.status(500).send('Error on password reset request.');
  }
});

// Password reset route
router.get('/auth/passwordReset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }
    res.render('passwordReset', { token: req.params.token });
  } catch (error) {
    logger.error('Error accessing password reset page: ' + error.message, { stack: error.stack });
    res.status(500).send('Error accessing password reset page.');
  }
});

router.post('/auth/passwordReset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)) {
      return res.status(400).send('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    const hash = await hashPassword(newPassword); // Use the hashPassword function from hashService
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save().catch(err => {
      logger.error('Error updating user password: ' + err.message, { stack: err.stack });
      throw err; // Rethrow to be caught by the outer catch block
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Your password has been changed',
      text: `Hello,\n\n` +
            `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };

    await transporter.sendMail(mailOptions).catch(err => {
      logger.error('Error sending password change confirmation email: ' + err.message, { stack: err.stack });
      throw err; // Rethrow to be caught by the outer catch block
    });

    logger.info('Password change confirmation email sent: ' + user.email);
    res.send('Your password has been updated.');
  } catch (error) {
    logger.error('Error resetting password: ' + error.message, { stack: error.stack });
    res.status(500).send('Error resetting password.');
  }
});

module.exports = router;