const mongoose = require('mongoose');

const historicalExchangeRateSchema = new mongoose.Schema({
  currency: { type: String, required: true },
  date: { type: Date, required: true },
  rate: { type: Number, required: true },
});

const HistoricalExchangeRate = mongoose.model('HistoricalExchangeRate', historicalExchangeRateSchema);

module.exports = HistoricalExchangeRate;
