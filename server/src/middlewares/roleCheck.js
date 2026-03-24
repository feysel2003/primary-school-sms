// This middleware checks if the logged-in user has the right role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user comes from our verifyToken middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to perform this action.' 
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };