const { Rating } = require('../models/Rating');
const { Post } = require('../models/Post');
const { asyncHandler, checkUserStatus, checkResource } = require('../utils/helperFunctions');

exports.ratings_get = asyncHandler(async (req, res, next) => {
  let title;
  if (req.query.post) title = `Post ${req.query.post} ratings`
  if (req.query.reviewer) title = `User ${req.query.reviewer} ratings`
  res.render('ratingViews/getRatings', { 
    title, 
    ratings: res.searchResults,
    url: req.originalUrl
  });
});

exports.ratings_post = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post);
  if (post.author && post.author.equals(req.user._id)) throw new Error('Own post rated')
  const rating = new Rating({ rating: req.body.rating, post: post._id, reviewer: req.user._id });
  await rating.save();
  await checkUserStatus(req);
  res.status(201).json({ success: true });
});