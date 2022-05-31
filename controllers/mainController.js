const { asyncHandler } = require('../utils/asyncHandler');

exports.index_get = asyncHandler((req, res, next) => {
  res.render('index');
});

exports.guitarTips_get = asyncHandler((req, res, next) => {
  res.render('guitar-tips');
});

exports.about_get = asyncHandler((req, res, next) => {
  res.render('about');
});

exports.badRequest_get = asyncHandler((req, res, next) => {
  res.render('404');
});