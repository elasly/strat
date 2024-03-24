const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then(() => console.log('MongoDB connected for updating users.'))
  .catch(err => console.error('MongoDB connection error:', err));

async function setSubscriptionToNull() {
  try {
    const result = await User.updateMany({}, { $unset: { subscriptionTier: "" } });
    console.log(`${result.nModified} users were updated to have no subscription tier.`);
  } catch (error) {
    console.error('Error updating users to have no subscription tier:', error.message, error.stack);
  } finally {
    mongoose.connection.close();
  }
}

setSubscriptionToNull();