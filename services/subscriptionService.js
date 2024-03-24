const Stripe = require('stripe');
const SubscriptionTier = require('../models/SubscriptionTier');
const logger = require('./logger');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // INPUT_REQUIRED {Add your Stripe secret key in the .env file}

async function createStripeProductAndPrice(tier) {
  try {
    const product = await stripe.products.create({
      name: tier.tierName,
    });

    const price = await stripe.prices.create({
      unit_amount: tier.price * 100, // Stripe requires amounts in cents
      currency: tier.currency,
      recurring: { interval: 'month' },
      product: product.id,
    });

    logger.info(`Stripe product and price created successfully for ${tier.tierName}`);
    return price.id;
  } catch (error) {
    logger.error('Stripe product/price creation failed', { message: error.message, stack: error.stack });
    throw error;
  }
}

async function createSubscriptionTier(tierDetails) {
  try {
    const priceId = await createStripeProductAndPrice(tierDetails);
    const tier = new SubscriptionTier({ ...tierDetails, stripePriceId: priceId });
    await tier.save();

    logger.info(`Subscription tier ${tier.tierName} created successfully with Stripe price ID: ${priceId}`);
    return tier;
  } catch (error) {
    logger.error('Subscription tier creation failed', { message: error.message, stack: error.stack });
    throw error;
  }
}

module.exports = {
  createSubscriptionTier,
};