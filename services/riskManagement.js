// services/riskManagement.js

/**
 * Applies risk management to a series of trades.
 * @param {Array} trades - The trades to apply risk management to.
 * @param {Object} strategy - The strategy containing risk management parameters.
 * @returns {Array} The trades after applying risk management.
 */
function applyRiskManagement(trades, strategy) {
  const { maxDrawdownLimit, leverage, diversificationRules, stopLoss, takeProfit } = strategy.riskManagement;
  let adjustedTrades = applyLeverage(trades, leverage);
  adjustedTrades = enforceMaxDrawdown(adjustedTrades, maxDrawdownLimit);
  adjustedTrades = applyStopLossTakeProfit(adjustedTrades, stopLoss, takeProfit);
  if (diversificationRules) {
    adjustedTrades = applyDiversification(adjustedTrades, diversificationRules);
  }
  return adjustedTrades;
}

/**
 * Applies leverage to trades.
 * @param {Array} trades - The trades to apply leverage to.
 * @param {Number} leverage - The leverage factor.
 * @returns {Array} The trades after applying leverage.
 */
function applyLeverage(trades, leverage) {
  return trades.map(trade => ({ ...trade, amount: trade.amount * leverage }));
}

/**
 * Enforces a maximum drawdown limit.
 * @param {Array} trades - The trades to enforce the drawdown limit on.
 * @param {Number} maxDrawdownLimit - The maximum drawdown limit.
 * @returns {Array} The trades after enforcing the drawdown limit.
 */
function enforceMaxDrawdown(trades, maxDrawdownLimit) {
  // Placeholder for drawdown calculation and enforcement logic
  // This would involve calculating running drawdown and stopping trading if limit is exceeded
  return trades; // Return modified trades array
}

/**
 * Applies diversification rules to trades.
 * @param {Array} trades - The trades to apply diversification to.
 * @param {Object} diversificationRules - The diversification rules.
 * @returns {Array} The trades after applying diversification.
 */
function applyDiversification(trades, diversificationRules) {
  // Placeholder for diversification logic
  // This could involve adjusting trade sizes based on asset types or sectors to meet diversification criteria
  return trades; // Return modified trades array
}

/**
 * Applies Stop Loss and Take Profit rules to trades.
 * @param {Array} trades - The trades to apply SL and TP to.
 * @param {Number|String} stopLoss - The stop loss value, can be a percentage or fixed value.
 * @param {Number|String} takeProfit - The take profit value, can be a percentage or fixed value.
 * @returns {Array} The trades after applying SL and TP.
 */
function applyStopLossTakeProfit(trades, stopLoss, takeProfit) {
  return trades.map(trade => {
    // Convert percentage SL/TP to fixed values if necessary and ensure they are numbers
    const slValue = stopLoss.includes('%') ? 
                    parseFloat(stopLoss) / 100 * trade.entryPrice : parseFloat(stopLoss);
    const tpValue = takeProfit.includes('%') ? 
                    parseFloat(takeProfit) / 100 * trade.entryPrice : parseFloat(takeProfit);

    // Apply SL and TP
    if (trade.type === 'buy') {
      trade.stopLossPrice = trade.entryPrice - slValue;
      trade.takeProfitPrice = trade.entryPrice + tpValue;
    } else if (trade.type === 'sell') {
      trade.stopLossPrice = trade.entryPrice + slValue;
      trade.takeProfitPrice = trade.entryPrice - tpValue;
    }
    return trade;
  });
}

module.exports = { applyRiskManagement };