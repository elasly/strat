const IndicatorValues = require('../models/IndicatorValues');
const { SMA, EMA, RSI, MACD } = require('technicalindicators');
const logger = require('./logger');

async function checkCachedIndicator(assetSymbol, timeframe, indicatorName) {
  try {
    return await IndicatorValues.findOne({ assetSymbol, timeframe, indicatorName });
  } catch (error) {
    logger.error(`Error checking cached indicator: ${error.message}`, error.stack);
    throw error;
  }
}

async function saveIndicatorValues(assetSymbol, timeframe, indicatorName, values) {
  try {
    const indicatorDocument = new IndicatorValues({ assetSymbol, timeframe, indicatorName, values });
    await indicatorDocument.save();
    logger.info(`Saved indicator values for ${assetSymbol}, ${timeframe}, ${indicatorName}`);
  } catch (error) {
    logger.error(`Error saving indicator values: ${error.message}`, error.stack);
    throw error;
  }
}

async function calculateAndCacheIndicators(assetData, assetSymbol, timeframe) {
  logger.info(`Calculating and caching indicators for ${assetSymbol}, ${timeframe}`);
  // Example: Calculating and caching SMA. Extend this for other indicators as needed.
  const closePrices = assetData.map(data => data.close);
  if (closePrices.length) {
    const smaValues = SMA.calculate({ period: 14, values: closePrices });
    const formattedValues = smaValues.map((value, index) => ({
      date: assetData[index].date,
      value
    }));
    await saveIndicatorValues(assetSymbol, timeframe, 'SMA', formattedValues);
    logger.info(`SMA values calculated and cached for ${assetSymbol}, ${timeframe}`);
  }
  // Repeat the process for other indicators (EMA, RSI, MACD, etc.)
}

module.exports = { checkCachedIndicator, calculateAndCacheIndicators };