const mongoose = require('mongoose');
require('dotenv').config();
const SubscriptionTier = require('../models/SubscriptionTier');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected for subscription tier insertion.'))
  .catch(err => console.error('MongoDB connection error:', err));

const subscriptionTiers = [
  {
    tierName: 'Silver',
    price: 1000, // Assuming price is in cents for Stripe
    currency: 'USD',
    strategiesLimit: 5,
    backtestsPerMonth: 100,
    optimizationsRuns: 20,
    stripePriceId: 'prod_J0qAXxG0VwdJLc' // Example Stripe price ID
  },
  {
    tierName: 'Gold',
    price: 2000, // Assuming price is in cents for Stripe
    currency: 'USD',
    strategiesLimit: 10,
    backtestsPerMonth: 200,
    optimizationsRuns: 40,
    stripePriceId: 'prod_J0qBYxG1XudJMd' // Example Stripe price ID
  },
  {
    tierName: 'Platinum',
    price: 3000, // Assuming price is in cents for Stripe
    currency: 'USD',
    strategiesLimit: 15,
    backtestsPerMonth: 300,
    optimizationsRuns: 60,
    stripePriceId: 'prod_J0qCZyG2WudKNe' // Example Stripe price ID
  }
];

SubscriptionTier.insertMany(subscriptionTiers)
  .then(() => {
    console.log('Subscription tiers successfully inserted into the database.');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error inserting subscription tiers into the database:', err.message, err.stack);
    mongoose.connection.close();
  });