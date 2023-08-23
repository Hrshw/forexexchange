const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hbs = require('hbs');
const path = require('path');
const Redis = require('ioredis');
const app = express();

// Create a Redis client
const redisClient = new Redis();
// Enable CORS
app.use(cors());

// Check if Redis is connected
redisClient.on('connect', () => {
    console.log('Redis connected');
});

// Check if Redis encounters an error
redisClient.on('error', (error) => {
    console.error('Redis error:', error);
});


//db connection
require('./src/db_conn/db')

// Set up Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));
hbs.registerPartials(path.join(__dirname, 'src/views/partials'));

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests per hour per IP
});
app.use(limiter);

// Routes
const conversionRoutes = require('./src/routes/conversionRoutes')(redisClient);
const exchangeRatesRoutes = require('./src/routes/exchangeRatesRoutes')(redisClient);
const historicalDataRoutes = require('./src/routes/historicalDataRoutes')(redisClient);


app.use('/api/conversion', conversionRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes);
app.use('/api/historical-data', historicalDataRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('conversion'); 
 });
 app.get('/exchangerate', (req, res) => {
    res.render('exchangeRates'); 
 });
 app.get('/historicaldata', (req, res) => {
    res.render('historicalData');
 });
// Listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
