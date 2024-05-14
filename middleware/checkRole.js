const checkRoles = (requiredRoles) => (req, res, next) => {
    const userRole = req.user.roles;
    const hasRoles = requiredRoles.some((role) => userRole.includes(role));
    if (!hasRoles) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
  
  module.exports = checkRoles;
  