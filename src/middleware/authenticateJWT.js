const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken; // Use the cookie name you set

  if (!token) {
    return res.redirect('/'); // Redirect to login page
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.redirect('/'); // Redirect to login page
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = authenticateJWT;
