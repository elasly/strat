const mongoose = require('mongoose');
const logger = require('../services/logger');

const indicatorParameterSchema = new mongoose.Schema({
  parameterName: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true } // The value of the parameter, can be number or string depending on the indicator
});

const indicatorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the indicator, e.g., "RSI", "SMA"
  parameters: [indicatorParameterSchema] // Parameters for each indicator, allowing customization
});

const comparisonSchema = new mongoose.Schema({
  conditionType: { type: String, enum: ['greaterThan', 'lessThan', 'equalTo'], required: true }, // Type of comparison, e.g., "greaterThan"
  referenceValue: { type: Number }, // The reference value for the comparison, can be null if comparing two indicators
  compareToValue: { type: Number }, // The value to compare to, can be null if comparing to another indicator
  compareToIndicator: { type: String } // The name of another indicator to compare to, can be null if comparing to a fixed value
});

const entryExitRuleSchema = new mongoose.Schema({
  indicatorName: { type: String, required: true }, // The name of the indicator used for the rule
  comparisons: [comparisonSchema] // Comparisons for entry or exit conditions, allowing multiple comparisons per rule
});

const strategySchema = new mongoose.Schema({
  strategyName: { type: String, required: true }, // Name of the strategy
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID of the strategy creator
  assetSymbol: { type: String, required: true }, // Symbol of the asset to which the strategy applies
  timeFrame: { type: String, required: true }, // Timeframe of the strategy, e.g., "1m", "5m", "1h"
  indicators: [indicatorSchema], // Array of indicators used in the strategy
  entryRules: [entryExitRuleSchema], // Array of entry rules for the strategy
  exitRules: [entryExitRuleSchema], // Array of exit rules for the strategy
  riskManagement: {
    stopLoss: { type: mongoose.Schema.Types.Mixed, required: true }, // Stop loss parameter, can be percentage or fixed value
    takeProfit: { type: mongoose.Schema.Types.Mixed, required: true } // Take profit parameter, can be percentage or fixed value
  },
  additionalRules: { type: String }, // Allows users to input comprehensive strategy details beyond the structured rules
  strategyRules: { type: String }, // Reintroduced to allow for additional textual strategy details
  creationDate: { type: Date, default: Date.now } // The date and time when the strategy was created
});

strategySchema.index({ userId: 1, strategyName: 1 }, { unique: true }); // Ensures that each strategy name is unique per user

strategySchema.pre('save', function (next) {
  logger.info(`Saving strategy: ${this.strategyName} for user ID: ${this.userId}`); // Log information before saving a strategy
  next();
});

strategySchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    logger.error(`Error saving strategy due to duplication: ${error.message}`, error.stack); // Handle duplication error
    next(new Error('Strategy name already exists. Please choose a different name.'));
  } else if (error) {
    logger.error(`Error saving strategy: ${error.message}`, error.stack); // Log any other errors
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('Strategy', strategySchema);