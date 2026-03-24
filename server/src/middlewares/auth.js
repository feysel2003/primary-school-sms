const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Check if the token is in the headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // 2. Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the user data (like tenantId and role) to the request!
    req.user = decoded; 
    
    next(); // Let them pass!
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { verifyToken };