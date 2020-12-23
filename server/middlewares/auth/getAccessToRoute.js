const jwt = require("jsonwebtoken");
const path = require("path");

const {
  isTokenIncluded,
  getAccessTokenFromHeaders,
} = require("../../helpers/auth/JwtTokenHelpers");

const CustomError = require("../../helpers/error/CustomError");

const getAccessToRoute = (req, res, next) => {
  //token check
  // console.log(req.headers.authorization);
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    //status: 401_unauth  403_ forbidden
    // Custom Error
    next(new CustomError("You are not authorized to access this route", 401));
  }

  const accessToken = getAccessTokenFromHeaders(req);

  // console.log(accessToken);

  //1 method

  // const verified = jwt.verify(accessToken, JWT_SECRET_KEY);
  // if (!verified) {
  //   return next(
  //     new CustomError("Token verification failed, authorization denied.", 401)
  //   );
  // }

  // req.user = {
  //   id: verified.id,
  //   firstName: verified.firstName,
  // };
  // next();
  // 2. Method
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      next(
        new CustomError("Token verification failed, authorization denied.", 401)
      );
    }
    // console.log(decoded);
    req.user = {
      id: decoded.id,
      firstName: decoded.firstName,
    };
    next();
  });

  // Custom Error
};

module.exports = getAccessToRoute;
