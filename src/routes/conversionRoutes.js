const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports = (redisClient) => {
    router.get('/', async (req, res) => {
        let { fromCurrency, toCurrency, amount } = req.query;
        fromCurrency = fromCurrency.toUpperCase();
        toCurrency = toCurrency.toUpperCase();

        const cacheKey = `${fromCurrency}_${toCurrency}`;

        try {
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData !== null) {
                const exchangeRate = parseFloat(cachedData);
                const convertedAmount = exchangeRate * parseFloat(amount);
                res.json({ convertedAmount, source: 'cache' });
            } else {
                const API_KEY = '018bff91af1547928a17cc1c05d84294';

                const response = await axios.get('https://openexchangerates.org/api/latest.json', {
                    params: {
                        app_id: API_KEY,
                        base: fromCurrency,
                    },
                });

                const exchangeRate = response.data.rates[toCurrency];
                const convertedAmount = exchangeRate * parseFloat(amount);

                await redisClient.setex(cacheKey, 3600, exchangeRate);

                res.json({ convertedAmount, source: 'live' });
            }
        } catch (error) {
            console.error('Conversion error:', error);
            res.status(500).json({ error: 'Error converting currency' });
        }
    });

    return router;
};
