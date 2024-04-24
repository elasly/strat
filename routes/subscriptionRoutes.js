const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { createSubscriptionTier } = require('../services/subscriptionService');
const SubscriptionTier = require('../models/SubscriptionTier');
const logger = require('../services/logger');

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

module.exports = router;