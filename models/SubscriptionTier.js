const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subscriptionTierSchema = new mongoose.Schema({
  tierName: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'usd' },
  strategiesLimit: { type: Number, required: true },
  backtestsPerMonth: { type: Number, required: true },
  optimizationsRuns: { type: Number, required: true },
  stripePriceId: { type: String, required: true }
});

subscriptionTierSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

subscriptionTierSchema.pre('save', function (next) {
  console.log(`Saving subscription tier: ${this.tierName}`);
  next();
});

subscriptionTierSchema.post('save', function (error, doc, next) {
  if (error) {
    console.error(`Error saving subscription tier: ${error.message}`, error.stack);
    next(error);
  } else {
    console.log(`Subscription tier saved successfully: ${doc.tierName}`);
    next();
  }
});

module.exports = mongoose.model('SubscriptionTier', subscriptionTierSchema);