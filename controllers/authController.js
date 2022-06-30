const { User } = require('../models/User');
const { 
  asyncHandler, 
  regenerateSession, 
  checkPassword, 
  checkResource, 
  checkResourceAndUpdate
} = require('../utils/helperFunctions');

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
  await checkPassword(req, user, password);
  regenerateSession(req, res, user, 200);
});

exports.signup_get = asyncHandler((req, res, next) => {
  res.render('authViews/signup', { title: 'Sign up' });
});

exports.signup_post = asyncHandler(async (req, res, next) => {
  const user = await User.create({ username: req.body.username, email: req.body.email, password: req.body.password });
  regenerateSession(req, res, user, 201);
});

exports.update_get = asyncHandler(async (req, res, next) => {
  const user = await checkResource(req, User);
  res.render('authViews/updateDetails', { title: 'Update my details', user });
});

exports.updateDetails_put = asyncHandler(async (req, res, next) => {
  const user = await checkResourceAndUpdate(req, User);
  regenerateSession(req, res, user, 200);
});

exports.updatePassword_put = asyncHandler(async (req, res, next) => {
  const user = await checkResource(req, User, '+password');
  await checkPassword(req, user, req.body.currentPassword);
  user.password = req.body.newPassword;
  await user.save();
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