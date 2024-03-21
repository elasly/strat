const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // INPUT_REQUIRED {configure your email username}
    pass: process.env.EMAIL_PASSWORD, // INPUT_REQUIRED {configure your email password}
  },
});

async function sendPasswordResetEmail(userEmail, token) {
  // Ensure the HOST variable correctly reflects your server's current host and port configuration
  const resetUrl = `http://${process.env.HOST}/auth/passwordReset/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: 'Password Reset Request',
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste it into your browser to complete the process:\n\n` +
          `${resetUrl}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${userEmail}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${userEmail}: ${error.message}`, error.stack);
    throw error;
  }
}

module.exports = { sendPasswordResetEmail };