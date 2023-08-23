const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    console.log('Received API Key:', apiKey); // Log the received API key

    if (!apiKey || apiKey !== 'your-api-key') {
        console.log('Invalid API Key'); // Log if the key is invalid
        return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
};



module.exports = authenticateAPIKey;
