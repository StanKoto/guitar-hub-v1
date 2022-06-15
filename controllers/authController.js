const { User } = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

const regenerateSession = (req, res, user, status) => {
  req.session.regenerate(err => {
    if (err) throw err
    req.session.user = user._id;
    req.session.save(err => {
      if (err) throw err
      res.status(status).json({ user });
    });
  });
};

exports.auth_get = asyncHandler((req, res, next) => {
  res.render('authViews/auth', { title: 'Authorization' });
});

exports.login_get = asyncHandler((req, res, next) => {
  res.render('authViews/login', { title: 'Log in' });
});

exports.login_post = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid credentials');
  regenerateSession(req, res, user, 200);
});

exports.logout_get = asyncHandler((req, res, next) => {
  req.session.user = null;
  req.session.save(err => {
    if (err) throw err
    req.session.regenerate(err => {
      if (err) throw err
      res.status(200).redirect('/auth');
    });
  });
});

exports.signup_get = asyncHandler((req, res, next) => {
  res.render('authViews/signup', { title: 'Sign up' });
});

exports.signup_post = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  regenerateSession(req, res, user, 201);
});

exports.update_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ErrorResponse(`No user found with id of ${req.user._id}`, 404);
  res.render('authViews/updateDetails', { title: 'Update my details', user });
});

exports.updateDetails_put = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email
  };
  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    runValidators: true,
    new: true
  });
  if (!user) throw new ErrorResponse(`No user found with id of ${req.user._id}`, 404)
  regenerateSession(req, res, user, 200);
});

exports.updatePassword_put = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ErrorResponse(`No user found with id of ${req.user._id}`, 404);
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) throw new Error('Invalid password')
  user.password = req.body.newPassword;
  await user.save();
  regenerateSession(req, res, user, 200);
});