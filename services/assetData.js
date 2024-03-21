const ccxt = require('ccxt');

async function fetchAssetData(exchangeId, symbol, timeframe = '1d', since = undefined, limit = undefined) {
  if (!ccxt.exchanges.includes(exchangeId)) {
    throw new Error(`Exchange ${exchangeId} is not supported.`);
  }

  const exchange = new ccxt[exchangeId]({ enableRateLimit: true });

  console.log(`Fetching asset data for ${symbol} from ${exchangeId} with timeframe ${timeframe}.`);

  try {
    await exchange.loadMarkets();
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, since, limit);
    // Format the data to be more readable and usable
    const formattedData = ohlcv.map(data => {
      return {
        timestamp: data[0],
        open: data[1],
        high: data[2],
        low: data[3],
        close: data[4],
        volume: data[5]
      };
    });
    console.log(`Successfully fetched and formatted asset data for ${symbol} from ${exchangeId}.`);
    return formattedData;
  } catch (error) {
    console.error(`Error fetching asset data from ${exchangeId} for ${symbol}:`, error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = {
  fetchAssetData
};