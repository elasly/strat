// models/BacktestResult.js

const mongoose = require('mongoose');

const backtestResultSchema = new mongoose.Schema({
  strategyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Strategy', required: true },
  backtestingParameters: {
    assetSymbol: String,
    timeFrame: String,
    startDate: Date,
    endDate: Date
  },
  performanceMetrics: {
    totalTrades: Number,
    winLossRatio: Number,
    maxDrawdown: Number,
    SharpeRatio: Number,
    comparedToBuyAndHold: Number
  },
  creationDate: { type: Date, default: Date.now }
});

backtestResultSchema.index({ strategyId: 1, creationDate: -1 });

backtestResultSchema.pre('save', function(next) {
  console.log('Saving backtest result for strategy ID:', this.strategyId);
  next();
});

backtestResultSchema.post('save', function(doc, next) {
  console.log('Backtest result saved successfully for strategy ID:', doc.strategyId);
  next();
});

backtestResultSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving backtest result for strategy ID:', doc.strategyId, error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('BacktestResult', backtestResultSchema);