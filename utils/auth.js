const { User } = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.checkAuthentication = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    req.user = await User.findById(req.session.user);
    next();
  } else res.redirect('/auth')
});

exports.checkRole = asyncHandler((req, res, next) => {
  if (req.user.role === 'admin') return next()
  throw new ErrorResponse('You are not authorized to access this resource!', 401);
});

exports.checkUser = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    res.locals.currentUser = await User.findById(req.session.user);
    return next();
  }
  res.locals.currentUser = null;
  next();
});