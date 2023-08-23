const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports = (redisClient) => {
    router.get('/', async (req, res) => {
        const { currency } = req.query;
        const cacheKey = `latest_${currency}`; // Create a cache key

        // Check if exchange rate is cached
        const cachedRate = await redisClient.get(cacheKey);

        if (cachedRate !== null) {
            res.json({ exchangeRate: parseFloat(cachedRate), source: 'cache' });
        } else {
            const API_KEY = '018bff91af1547928a17cc1c05d84294';

            try {
                const response = await axios.get('https://openexchangerates.org/api/latest.json', {
                    params: {
                        app_id: API_KEY,
                        base: 'USD', // Set the base currency as required
                    },
                });

                const exchangeRates = response.data.rates;

                if (currency in exchangeRates) {
                    const exchangeRate = exchangeRates[currency];

                    // Store exchange rate in Redis cache
                    await redisClient.setex(cacheKey, 3600, exchangeRate);

                    res.json({ exchangeRate, source: 'live' });
                } else {
                    res.status(404).json({ error: 'Currency not found' });
                }
            } catch (error) {
                console.error('Exchange rate error:', error);
                res.status(500).json({ error: 'Error fetching exchange rate' });
            }
        }
    });

    return router;
};
