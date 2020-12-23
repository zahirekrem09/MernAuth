const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/auth/JwtTokenHelpers");
const comparePassword = require("../helpers/auth/comparePassword");
const validateUserInput = require("../helpers/auth/inputHelpers");

const authRegister = asyncErrorWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //TODO1 : Input validate

  if (!firstName || !email || !password) {
    return next(new CustomError("Please check your inputs!", 400));
  }
  //TODO2: Check already registered  or Customerror Duplicate key error (code: 11000)

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return next(new CustomError("User already exists with this email", 400));
  }

  //TODO4: Save the User

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  sendJwtToClient(user, res);

});

const authLogin = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs!", 400));
  }
  // async await;
  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check  your credentials!", 400));
  }
  // console.log(user);
  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
  sendJwtToClient(user, res);
});

const authLogout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

const authCurrentUser = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new CustomError("User does not exist", 400));
  }
  // res.json(user);

  return res.status(200).json({
    success: true,
    user: user,
  });
});

module.exports = {
  authRegister,
  authLogin,
  authLogout,
  authCurrentUser,
};
