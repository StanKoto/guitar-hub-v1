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

exports.badRequest_get = asyncHandler((req, res, next) => {
  res.render('404', { title: '404' });
});