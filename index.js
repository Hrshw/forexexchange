require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hbs = require('hbs');
const path = require('path');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
const authenticateJWT = require('./src/middleware/authenticateJWT');
const app = express();
app.set('trust proxy', 1);


// Retrieve Redis host and port from environment variables
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

// Create a Redis client
const redisClient = Redis.createClient({
  host: redisHost,
  port: redisPort,
  // other configuration options
});
// Enable CORS
app.use(cors());
app.use(cookieParser());

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

app.use(express.urlencoded({ extended: true }));

// Import the auth router and apply it as middleware
const authRouter = require('./src/routes/auth');
app.use(authRouter);

// Routes for other functionalities
const conversionRoutes = require('./src/routes/conversionRoutes')(redisClient);
const exchangeRatesRoutes = require('./src/routes/exchangeRatesRoutes')(redisClient);
const historicalDataRoutes = require('./src/routes/historicalDataRoutes')(redisClient);
const HistoricalExchangeRate = require('./src/models/HistoricalExchangeRate');
const historicalRatesRoutes = require('./src/routes/getHistoricalData')();
app.use('/api/historical-rates', historicalRatesRoutes);

// Route for rendering the historical rates view
app.get('/historical-rates', authenticateJWT, async (req, res) => {
    try {
        const historicalRates = await HistoricalExchangeRate.find({}).sort({ date: -1 }).limit(7);
        res.render('historicalRates', { rates: historicalRates });
    } catch (error) {
        console.error('Error fetching historical rates:', error);
        res.status(500).json({ error: error.message }); // Return the actual error message
    }
});

app.use('/api/conversion', conversionRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes);
app.use('/api/historical-data', historicalDataRoutes);
app.use('/api/historical-rates', historicalRatesRoutes);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('login');
});
// Add your protected routes here
app.get('/conversion',authenticateJWT, (req, res) => {
    res.render('conversion');
});

app.get('/exchangerate',authenticateJWT, (req, res) => {
    res.render('exchangeRates');
});

app.get('/historicaldata',authenticateJWT, (req, res) => {
    res.render('historicalData');
});

// Listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
