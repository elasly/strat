const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleware');
const Strategy = require('../models/Strategy');
const BacktestResult = require('../models/BacktestResult'); // Ensure this model exists and is properly defined
const { hasPermission } = require('../services/rolePermissions');
const logger = require('../services/logger');

router.get('/api/strategies', isAuthenticated, async (req, res) => {
    try {
        const user = req.user;
        let strategies;
        if (hasPermission(user.role, 'view_any_strategy')) {
            strategies = await Strategy.find({}).lean();
            logger.info(`Admin fetched all strategies. User ID: ${user._id}`);
        } else {
            strategies = await Strategy.find({ userId: req.session.userId }).lean();
            logger.info(`Fetched ${strategies.length} strategies for user ID: ${req.session.userId}`);
        }
        res.json({ strategies });
    } catch (error) {
        logger.error('Error fetching strategies:', { message: error.message, stack: error.stack });
        res.status(500).send('Error fetching strategies');
    }
});

router.post('/api/strategies', isAuthenticated, async (req, res) => {
    try {
        const { strategyName, assetSymbol, timeFrame, strategyRules, strategyType } = req.body;
        const newStrategy = new Strategy({
            strategyName,
            userId: req.session.userId,
            assetSymbol,
            timeFrame,
            strategyRules,
            strategyType
        });
        await newStrategy.save();
        logger.info(`Strategy created successfully. Strategy name: ${strategyName}, User ID: ${req.session.userId}`);
        res.status(201).json({ message: 'Strategy created successfully', strategy: newStrategy });
    } catch (error) {
        logger.error('Error creating strategy:', { message: error.message, stack: error.stack });
        res.status(500).send('Error creating strategy');
    }
});

router.delete('/api/strategies/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const strategy = await Strategy.findById(id);

        if (!strategy) {
            logger.warn(`Strategy not found. Strategy ID: ${id}`);
            return res.status(404).send('Strategy not found');
        }

        if (strategy.userId.toString() !== req.session.userId && !hasPermission(req.user.role, 'delete_any_strategy')) {
            logger.warn(`User does not have permission to delete this strategy. Strategy ID: ${id}, User ID: ${req.session.userId}`);
            return res.status(403).send('You do not have permission to delete this strategy');
        }

        await strategy.remove();
        logger.info(`Strategy deleted successfully. Strategy ID: ${id}`);
        res.status(200).json({ message: 'Strategy deleted successfully' });
    } catch (error) {
        logger.error('Error deleting strategy:', { message: error.message, stack: error.stack });
        res.status(500).send('Error deleting strategy');
    }
});

// New endpoint for fetching backtest results
router.get('/api/backtestResults', isAuthenticated, async (req, res) => {
    try {
        const backtestResults = await BacktestResult.find({}).lean(); // Fetch all backtest results, consider filtering by user or strategy if needed
        logger.info('Fetched all backtest results.');
        res.json(backtestResults);
    } catch (error) {
        logger.error('Error fetching backtest results:', { message: error.message, stack: error.stack });
        res.status(500).send('Error fetching backtest results');
    }
});

module.exports = router;