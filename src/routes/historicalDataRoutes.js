const express = require('express');
const axios = require('axios');
const HistoricalExchangeRate = require('../models/HistoricalExchangeRate');
const router = express.Router();

module.exports = (redisClient) => {
    router.get('/', async (req, res) => {
        const { currency, date } = req.query;
        const cacheKey = `historical_${currency}_${date}`; // Create a cache key

        // Check if historical rate is cached
        const cachedRate = await redisClient.get(cacheKey);

        if (cachedRate !== null) {
            res.json({ exchangeRate: parseFloat(cachedRate), source: 'cache' });
        } else {
            const API_KEY = '018bff91af1547928a17cc1c05d84294';

            try {
                const response = await axios.get(`https://openexchangerates.org/api/historical/${date}.json`, {
                    params: {
                        app_id: API_KEY,
                        base: 'USD', // Set the base currency as required
                    },
                });

                const historicalRates = response.data.rates;

                if (currency in historicalRates) {
                    const exchangeRate = historicalRates[currency];

                    // Store historical rate in Redis cache
                    await redisClient.setex(cacheKey, 3600, exchangeRate);

                    // Store historical rate in MongoDB
                    const historicalRate = new HistoricalExchangeRate({
                        currency,
                        date,
                        rate: exchangeRate,
                    });
                    await historicalRate.save();

                    res.json({ exchangeRate, source: 'live' });
                } else {
                    res.status(404).json({ error: 'Currency not found in historical data' });
                }
            } catch (error) {
                console.error('Historical data error:', error);
                res.status(500).json({ error: 'Error fetching historical data' });
            }
        }
    });

    return router;
};
