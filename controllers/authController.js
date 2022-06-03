const { User } = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

exports.auth_get = asyncHandler((req, res, next) => {
  res.render('auth', { title: 'Authorization' });
});

exports.login_get = asyncHandler((req, res, next) => {
  res.render('login', { title: 'Log in' });
});

exports.login_post = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.login(email, password);
  req.session.regenerate(err => {
    if (err) console.error(err)
    req.session.user = user._id;
    req.session.save(err => {
      if (err) throw err
      res.json({ user });
    });
  });
});

exports.logout_get = asyncHandler((req, res, next) => {
  req.session.user = null;
  req.session.save(err => {
    if (err) throw err
    req.session.regenerate(err => {
      if (err) console.error(err)
      res.redirect('/auth');
    });
  });
});

exports.signup_get = asyncHandler((req, res, next) => {
  res.render('signup', { title: 'Sign up' });
});

exports.signup_post = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  req.session.regenerate(err => {
    if (err) console.error(err)
    req.session.user = user._id;
    req.session.save(err => {
      if (err) throw err
      res.json({ user });
    });
  });
});