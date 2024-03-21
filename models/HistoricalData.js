const mongoose = require('mongoose');

const historicalDataSchema = new mongoose.Schema({
  assetSymbol: { type: String, required: true },
  timeframe: { type: String, required: true }, // e.g., '1m', '5m', '1h', '1d'
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  timestamp: { type: Date, required: true }
}, { timestamps: true });

// Indexes to improve query performance
historicalDataSchema.index({ assetSymbol: 1, timeframe: 1, timestamp: 1 });

const HistoricalData = mongoose.model('HistoricalData', historicalDataSchema);

module.exports = HistoricalData;