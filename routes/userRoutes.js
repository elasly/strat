const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');
const SubscriptionTier = require('../models/SubscriptionTier');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const router = express.Router();

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password -__v');
        const subscriptionTiers = await SubscriptionTier.find({});
        if (!user) {
            console.log(`User not found with ID: ${req.session.userId}`);
            return res.status(404).send('User not found');
        }
        console.log(`Displaying profile for user ID: ${req.session.userId}`);
        res.render('profile', { user, messages: req.flash('success'), subscriptionTiers });
    } catch (error) {
        console.error('Error fetching user profile:', error.message, error.stack);
        res.status(500).send('Error displaying user profile');
    }
});

router.post('/updateProfile', isAuthenticated, async (req, res) => {
  const { email, phone, mailingAddress } = req.body;
  try {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      console.log('Invalid email format.');
      return res.status(400).json({success: false, message: 'Invalid email format.'});
    }
    
    await User.updateOne({_id: req.session.userId}, {
      $set: {
        email: email,
        phone: phone,
        mailingAddress: mailingAddress
      }
    });

    const updatedUser = await User.findById(req.session.userId).select('-password -__v');
    if (!updatedUser) {
      return res.status(404).json({success: false, message: 'User not found after update attempt.'});
    }

    console.log(`Profile updated for user ID: ${req.session.userId}`);
    res.json({ success: true, message: 'Profile updated successfully.', userData: { email: updatedUser.email, phone: updatedUser.phone, mailingAddress: updatedUser.mailingAddress } });
  } catch (error) {
    console.error('Error updating user profile:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.stack });
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
    console.error('Error cancelling subscription:', error.message, error.stack);
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
    console.error('Error changing subscription tier:', error.message, error.stack);
    res.status(500).send('Error changing subscription tier');
  }
});

module.exports = router;