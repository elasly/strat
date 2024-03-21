const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { backtestStrategy } = require('../services/backtestEngine');
const { compilePerformanceMetrics } = require('../services/performanceMetrics');
const { getHistoricalDataInRange } = require('../services/historicalDataService');
const logger = require('../services/logger');

const router = express.Router();

router.post('/backtest', isAuthenticated, async (req, res) => {
    try {
        const { strategyDefinition, startDate, endDate, assetSymbol, timeframe } = req.body;
        const historicalData = await getHistoricalDataInRange(assetSymbol, timeframe, new Date(startDate), new Date(endDate));

        if (historicalData.length === 0) {
            logger.warn(`No historical data available for ${assetSymbol} in specified range: ${startDate} to ${endDate}`);
            return res.status(400).json({ message: "No historical data available for the specified range or asset." });
        }

        const strategyInput = {
            ...strategyDefinition,
            historicalData
        };

        const backtestResults = await backtestStrategy(strategyInput);
        const performanceMetrics = compilePerformanceMetrics(backtestResults.trades);

        logger.info(`Backtesting completed successfully for ${assetSymbol} from ${startDate} to ${endDate}.`);
        res.json({
            message: "Backtesting completed successfully.",
            performanceMetrics,
            visualizationData: backtestResults.visualizationData
        });
    } catch (error) {
        logger.error('Error processing backtest request:', { message: error.message, stack: error.stack });
        res.status(500).send('Error processing backtest request');
    }
});

module.exports = router;