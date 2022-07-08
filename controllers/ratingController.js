const { Rating } = require('../models/Rating');
const { Post } = require('../models/Post');
const { asyncHandler, checkUserStatus, checkResource } = require('../utils/helperFunctions');

exports.ratings_get = asyncHandler(async (req, res, next) => {
  let title;
  if (req.baseUrl.includes('post-ratings')) title = `Post ${req.params.id} ratings`
  if (req.path.includes('given-ratings')) title = `Ratings given by ${req.params.slug}`
  if (req.path.includes('received-ratings')) title = `Ratings received by ${req.params.slug}`
  res.render('ratingViews/getRatings', { 
    title, 
    data: res.searchResults, 
    path: req.baseUrl + req.path, 
    id: req.params.id, 
    slug: req.params.slug 
  });
});

exports.ratings_post = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post);
  if (post.author && post.author.equals(req.user._id)) throw new Error('Own post rated')
  const rating = new Rating({
    rating: req.body.rating, 
    post: post._id, 
    reviewer: req.user._id,
    recipient: post.author
  });
  await rating.save();
  await checkUserStatus(req);
  res.status(201).json({ success: true });
});