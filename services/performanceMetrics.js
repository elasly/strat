/**
 * Calculates a set of performance metrics for backtested trading strategy results.
 */

/**
 * Calculate the net profit or loss.
 * @param {Array} trades - Array of trade objects with profit or loss for each trade.
 * @returns {Number} Net profit or loss.
 */
function calculateNetProfit(trades) {
  return trades.reduce((acc, trade) => acc + trade.profit, 0);
}

/**
 * Calculate the win rate.
 * @param {Array} trades - Array of trade objects.
 * @returns {Number} Win rate as a percentage.
 */
function calculateWinRate(trades) {
  const wins = trades.filter(trade => trade.profit > 0).length;
  return (wins / trades.length) * 100;
}

/**
 * Calculate the maximum drawdown.
 * @param {Array} trades - Array of trade objects.
 * @returns {Number} Maximum drawdown as a percentage.
 */
function calculateMaxDrawdown(trades) {
  let cumulativeProfit = 0;
  let peak = 0;
  let maxDrawdown = 0;

  trades.forEach(trade => {
    cumulativeProfit += trade.profit;
    if (cumulativeProfit > peak) {
      peak = cumulativeProfit;
    }
    const drawdown = peak - cumulativeProfit;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

/**
 * Calculate the Sharpe ratio.
 * @param {Array} trades - Array of trade objects.
 * @param {Number} riskFreeRate - The risk-free rate of return, annualized.
 * @returns {Number} The Sharpe ratio.
 */
function calculateSharpeRatio(trades, riskFreeRate = 0) {
  const returns = trades.map(trade => trade.profit / trade.entryPrice);
  const meanReturn = returns.reduce((acc, ret) => acc + ret, 0) / returns.length;
  const excessReturn = meanReturn - riskFreeRate;
  const standardDeviation = Math.sqrt(returns.reduce((acc, ret) => acc + Math.pow(ret - meanReturn, 2), 0) / returns.length);

  return standardDeviation !== 0 ? excessReturn / standardDeviation : 0;
}

/**
 * Compile and return all calculated performance metrics.
 * @param {Array} trades - Array of trade objects.
 * @returns {Object} An object containing all performance metrics.
 */
function compilePerformanceMetrics(trades) {
  console.log('Compiling performance metrics for backtest results...');
  try {
    const metrics = {
      netProfit: calculateNetProfit(trades),
      winRate: calculateWinRate(trades),
      maxDrawdown: calculateMaxDrawdown(trades),
      sharpeRatio: calculateSharpeRatio(trades),
    };
    console.log('Performance metrics compiled successfully.');
    return metrics;
  } catch (error) {
    console.error('Error compiling performance metrics:', error.message, error.stack);
    throw error;
  }
}

module.exports = {
  compilePerformanceMetrics,
};