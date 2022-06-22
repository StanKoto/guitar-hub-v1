const { Rating } = require('../models/Rating');
const { Post } = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.ratings_get = asyncHandler(async (req, res, next) => {
  if (req.query.post) {
    res.render('ratingViews/getRatings', { title: `Post ${req.query.post} ratings`, ratings: res.searchResults });
  }

  if (req.query.reviewer) {
    res.render('ratingViews/getRatings', { title: `User ${req.query.reviewer} ratings`, ratings: res.searchResults });
  }
});

exports.ratings_post = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) throw new ErrorResponse(`No post found with id of ${postId}`, 404);
  if (post.author && post.author.equals(req.user._id)) throw new Error('Own post rated')
  const dataToInsert = { rating: req.body.rating, post: postId, reviewer: req.user._id };
  const rating = new Rating(dataToInsert);
  await rating.save();
  res.status(201).json({ success: true });
});