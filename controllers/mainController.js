const { asyncHandler } = require('../utils/asyncHandler');

exports.index_get = asyncHandler((req, res, next) => {
  res.render('index', { title: 'Guitar Wiki' });
});

exports.guitarTips_get = asyncHandler((req, res, next) => {
  res.render('guitar-tips', { title: 'Guitar Tips' });
});

exports.about_get = asyncHandler((req, res, next) => {
  res.render('about', { title: 'About' });
});

exports.serverError_get = asyncHandler((req, res, next) => {
  res.render('500', { title: '500' });
})

exports.badRequest_get = asyncHandler((req, res, next) => {
  res.render('404', { title: '404' });
});