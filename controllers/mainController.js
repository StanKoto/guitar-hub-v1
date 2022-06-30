const { asyncHandler } = require('../utils/helperFunctions');

exports.index_get = asyncHandler((req, res, next) => {
  res.render('mainViews/index', { title: 'Guitar Wiki' });
});

exports.guitarTips_get = asyncHandler((req, res, next) => {
  res.render('mainViews/guitar-tips', { title: 'Guitar Tips' });
});

exports.manageUsers_get = asyncHandler((req, res, next) => {
  res.render('mainViews/manageUsers', { title: 'User Management' });
});

exports.about_get = asyncHandler((req, res, next) => {
  res.render('mainViews/about', { title: 'About' });
});

exports.serverError_get = asyncHandler((req, res, next) => {
  res.status(500).render('errorViews/500', { title: '500' });
})

exports.unauthorized_get = asyncHandler((req, res, next) => {
  res.status(401).render('errorViews/401', { title: '401', message: req.query.message });
})

exports.badRequest_get = asyncHandler((req, res, next) => {
  res.status(404).render('errorViews/404', { title: '404', message: req.query.message || 'Oops! It seems the page you wanted to reach does not exist!' });
});