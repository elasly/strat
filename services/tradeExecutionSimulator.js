/**
 * Simulates trade execution considering slippage, commission, and liquidity.
 * Supports market, limit, and stop orders.
 */
class TradeExecutionSimulator {
  constructor() {
    // Define default slippage percentage and commission per trade
    this.defaultSlippagePercentage = 0.05; // 0.05% slippage
    this.defaultCommission = 1; // 1 unit of currency per trade
  }

  /**
   * Simulates execution of a trade order considering liquidity and allows for partial fills.
   * @param {Object} order - The order to be executed.
   * @param {Number} price - The current price of the asset.
   * @param {Number} availableVolume - The available volume at the given price point.
   * @returns {Object} The result of the trade execution.
   */
  executeOrder(order, price, availableVolume) {
    let executedPrice = price;
    let commission = this.defaultCommission;
    let executedVolume = Math.min(order.quantity, availableVolume);
    let partialFill = executedVolume < order.quantity;

    // Simulate slippage for market orders
    if (order.type === 'market') {
      const slippage = price * this.defaultSlippagePercentage / 100;
      executedPrice = order.side === 'buy' ? price + slippage : price - slippage;
      console.log(`Market order executed with slippage. Side: ${order.side}, Executed price: ${executedPrice}, Commission: ${commission}`);
    }

    // For limit and stop orders, check if the order can be executed
    if (order.type === 'limit' && ((order.side === 'buy' && price > order.price) || (order.side === 'sell' && price < order.price))) {
      console.log(`Limit order not executed. Side: ${order.side}, Order price: ${order.price}, Current price: ${price}`);
      return { executed: false, reason: 'Price not met for limit order.' };
    }

    if (order.type === 'stop' && ((order.side === 'buy' && price < order.price) || (order.side === 'sell' && price > order.price))) {
      console.log(`Stop order not executed. Side: ${order.side}, Order price: ${order.price}, Current price: ${price}`);
      return { executed: false, reason: 'Price not reached for stop order.' };
    }

    // Simulate liquidity impact
    if (partialFill) {
      console.log(`Order partially filled due to insufficient liquidity. Requested: ${order.quantity}, Executed: ${executedVolume}`);
    }

    // Return the result of the trade execution
    return {
      executed: true,
      executedPrice,
      commission,
      side: order.side,
      quantity: executedVolume,
      totalCost: (executedPrice * executedVolume) + commission,
      partialFill,
    };
  }
}

module.exports = TradeExecutionSimulator;