const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Strategy = require('../models/Strategy');

router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const strategies = await Strategy.find({ userId: req.session.userId }).lean();
        res.render('dashboard', { strategies });
    } catch (error) {
        console.error('Error fetching strategies for dashboard:', error.message, error.stack);
        res.status(500).send('Error displaying dashboard');
    }
});

module.exports = router;