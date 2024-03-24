const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { createSubscriptionTier } = require('../services/subscriptionService');
const SubscriptionTier = require('../models/SubscriptionTier');
const logger = require('../services/logger');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const User = require('../models/User');

const router = express.Router();

router.post('/subscription/createTier', isAuthenticated, async (req, res) => {
  try {
    const tier = await createSubscriptionTier(req.body);
    logger.info(`New subscription tier created: ${tier.tierName}`);
    res.status(200).json(tier);
  } catch (error) {
    logger.error('Failed to create subscription tier', { error: error.message, stack: error.stack });
    res.status(500).send(error.message);
  }
});

router.get('/subscription/tiers', async (req, res) => {
  try {
    const tiers = await SubscriptionTier.find({});
    logger.info('Fetched all subscription tiers');
    res.status(200).json(tiers);
  } catch (error) {
    logger.error('Failed to fetch subscription tiers', { error: error.message, stack: error.stack });
    res.status(500).send(error.message);
  }
});

// Cancel subscription
router.post('/subscription/cancelSubscription', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.stripeSubscriptionId) {
      await stripe.subscriptions.del(user.stripeSubscriptionId);
      user.stripeSubscriptionId = null;
      await user.save();
    }
    res.redirect('/profile');
  } catch (error) {
    logger.error('Error cancelling subscription:', error.message, error.stack);
    res.status(500).send('Error cancelling subscription');
  }
});

// Change subscription tier
router.post('/subscription/changeSubscriptionTier', isAuthenticated, async (req, res) => {
  try {
    const { newTier } = req.body;
    const user = await User.findById(req.session.userId);
    if (user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const newTierDetails = await SubscriptionTier.findOne({ tierName: newTier });
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newTierDetails.stripePriceId,
        }],
      });
      user.subscriptionTier = newTier;
      await user.save();
    }
    res.redirect('/profile');
  } catch (error) {
    logger.error('Error changing subscription tier:', error.message, error.stack);
    res.status(500).send('Error changing subscription tier');
  }
});

module.exports = router;