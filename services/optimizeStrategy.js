const { backtestStrategy } = require('./backtestEngine');
const logger = require('./logger');

async function optimizeStrategy(strategy, optimizationConfig) {
  logger.info('Starting strategy optimization...');

  let bestConfiguration = null;
  let bestMetricValue = -Infinity;
  
  // Simple grid search for optimization over provided parameter ranges
  for (let paramValue = optimizationConfig.range.start; paramValue <= optimizationConfig.range.end; paramValue += optimizationConfig.step) {
    const modifiedStrategy = {
      ...strategy,
      settings: { ...strategy.settings, [optimizationConfig.parameter]: paramValue }
    };

    try {
      const { performanceMetrics } = await backtestStrategy(modifiedStrategy);
      const metricValue = performanceMetrics[optimizationConfig.metric];

      if (metricValue > bestMetricValue) {
        bestMetricValue = metricValue;
        bestConfiguration = modifiedStrategy.settings;
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

  return bestConfiguration;
}

module.exports = { optimizeStrategy };