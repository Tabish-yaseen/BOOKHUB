const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedToken);
    req.isAuth = true;
    req.authorId = decodedToken.authorId;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
};
