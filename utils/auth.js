const { User } = require('../models/User');
const { ErrorResponse } = require('../utils/error-handling');

exports.checkAuthentication = async (req, res, next) => {
  if (req.session.user) {
    try {
      req.user = await User.findById(req.session.user);
      next()
    } catch (err) {
      console.error(err);
    }
  }
  else res.redirect('/auth')
};

exports.checkRole = (req, res, next) => {
  if (req.user.role === 'admin') return next()
  next(new ErrorResponse('You are not authorized to access this resource!'), 401);
};