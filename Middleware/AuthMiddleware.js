const jwt = require('jsonwebtoken');

const AuthMiddleware = async (req, res, next) => {
  let token = req.cookies.token || req.headers['authorization'];

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    console.log("Authentication faled");
    return res.status(401).json({ message: 'Authentication token is required' });
    
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = AuthMiddleware;
