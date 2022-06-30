const { Rating } = require('../models/Rating');
const { Post } = require('../models/Post');
const { asyncHandler, checkStatus, checkResource } = require('../utils/helperFunctions');

exports.ratings_get = asyncHandler(async (req, res, next) => {
  if (req.query.post) {
    res.render('ratingViews/getRatings', { title: `Post ${req.query.post} ratings`, ratings: res.searchResults });
  }

  if (req.query.reviewer) {
    res.render('ratingViews/getRatings', { title: `User ${req.query.reviewer} ratings`, ratings: res.searchResults });
  }
});

exports.ratings_post = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post);
  if (post.author && post.author.equals(req.user._id)) throw new Error('Own post rated')
  const rating = new Rating({ rating: req.body.rating, post: post._id, reviewer: req.user._id });
  await rating.save();
  await checkStatus(req);
  res.status(201).json({ success: true });
});