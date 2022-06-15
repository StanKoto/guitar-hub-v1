const { asyncHandler } = require('../utils/asyncHandler');

exports.index_get = asyncHandler((req, res, next) => {
  res.render('mainViews/index', { title: 'Guitar Wiki' });
});

exports.guitarTips_get = asyncHandler((req, res, next) => {
  res.render('mainViews/guitar-tips', { title: 'Guitar Tips' });
});

exports.manageUsers_get = asyncHandler((req, res, next) => {
  res.render('mainViews/manageUsers.ejs', { title: 'User Management' });
});

exports.about_get = asyncHandler((req, res, next) => {
  res.render('mainViews/about', { title: 'About' });
});

exports.serverError_get = asyncHandler((req, res, next) => {
  res.render('errorViews/500', { title: '500' });
})

exports.badRequest_get = asyncHandler((req, res, next) => {
  res.render('errorViews/404', { title: '404', message: 'Oops! It seems the page you wanted to reach does not exist!' });
});