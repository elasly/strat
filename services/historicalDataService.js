const HistoricalData = require('../models/HistoricalData');

/**
 * Retrieves historical data for a given asset symbol and timeframe within a specified date range.
 * @param {String} assetSymbol - The symbol of the asset.
 * @param {String} timeframe - The timeframe of the data.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Array>} - A promise that resolves to an array of historical data points.
 */
async function getHistoricalDataInRange(assetSymbol, timeframe, startDate, endDate) {
  try {
    const data = await HistoricalData.find({
      assetSymbol,
      timeframe,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order
    console.log(`Fetched ${data.length} historical data points for ${assetSymbol} in timeframe ${timeframe} from ${startDate} to ${endDate}.`);
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error.message, error.stack);
    throw error;
  }
}

module.exports = { getHistoricalDataInRange };