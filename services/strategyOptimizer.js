const { backtestStrategy } = require('./backtestEngine');
const logger = require('./logger');

/**
 * Performs strategy optimization using grid search.
 * @param {Object} strategy - The base strategy to optimize.
 * @param {Object} optimizationConfig - Configuration for optimization, including parameter range and step.
 * @returns {Promise<Object>} - The optimized strategy configuration and its performance metrics.
 */
async function optimizeStrategy(strategy, optimizationConfig) {
  logger.info('Starting strategy optimization...');

  let bestConfiguration = null;
  let bestPerformanceMetrics = null;
  let bestMetricValue = -Infinity;

  for (let paramValue = optimizationConfig.range.start; paramValue <= optimizationConfig.range.end; paramValue += optimizationConfig.step) {
    // Clone the strategy and set the current parameter value
    const strategyClone = JSON.parse(JSON.stringify(strategy));
    strategyClone.parameters[optimizationConfig.parameter] = paramValue;

    try {
      const results = await backtestStrategy(strategyClone);
      const metricValue = results.performanceMetrics[optimizationConfig.metric];

      if (metricValue > bestMetricValue) {
        bestMetricValue = metricValue;
        bestConfiguration = strategyClone.parameters;
        bestPerformanceMetrics = results.performanceMetrics;
      }
    } catch (error) {
      logger.error(`Error during strategy optimization for paramValue ${paramValue}: ${error}`, { stack: error.stack });
    }
  }

  if (bestConfiguration) {
    logger.info(`Optimization complete. Best configuration: ${JSON.stringify(bestConfiguration)} with metric value: ${bestMetricValue}`);
  } else {
    logger.warn('Optimization complete but no better configuration found.');
  }

  return { bestConfiguration, bestPerformanceMetrics };
}

module.exports = { optimizeStrategy };