const express = require('express');
const HistoricalExchangeRate = require('../models/HistoricalExchangeRate');
const router = express.Router();

module.exports = () => {
    router.get('/', async (req, res) => {
        try {
            // Retrieve historical rates from MongoDB
            const historicalRates = await HistoricalExchangeRate.find({}).sort({ date: -1 }).limit(7);
            console.log(historicalRates);
            res.render('historicalRates', { rates: historicalRates }); // Pass the rates to the view
        } catch (error) {
            console.error('Error fetching historical rates:', error);
            res.status(500).json({ error: 'Error fetching historical rates' });
        }
    });

    return router;
};
