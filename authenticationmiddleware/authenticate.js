const jwt = require('jsonwebtoken')
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  

  try {
    const decodedToken =jwt.verify(authHeader,process.env.JWT_SECRET);
    
    
    req.isAuth = true;
    req.authorId = decodedToken.authorId;
    // console.log(decodedToken)
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
};
