const mongoose = require('mongoose');

const indicatorValuesSchema = new mongoose.Schema({
  assetSymbol: { type: String, required: true },
  timeframe: { type: String, required: true },
  indicatorName: { type: String, required: true },
  values: [{
    date: { type: Date, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  }]
});

indicatorValuesSchema.pre('save', function(next) {
  console.log(`Saving indicator values for ${this.assetSymbol} using ${this.indicatorName} on timeframe ${this.timeframe}`);
  next();
});

indicatorValuesSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error(`Error saving indicator values for ${doc.assetSymbol}:`, error.message, error.stack);
    next(error);
  } else {
    console.log(`Indicator values for ${doc.assetSymbol} using ${doc.indicatorName} on timeframe ${doc.timeframe} saved successfully.`);
    next();
  }
});

module.exports = mongoose.model('IndicatorValues', indicatorValuesSchema);