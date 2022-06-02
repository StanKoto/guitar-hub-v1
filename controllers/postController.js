const { Post } = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.posts_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();
  res.render('posts', { posts });
});

exports.posts_post = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;
  const post = await Post.create(req.body);
  res.send(post);
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new ErrorResponse(`No post found with ID of ${id}`, 404))
  res.send(post);
});

exports.post_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) return next(new ErrorResponse(`No post found with ID of ${id}`, 404))
  if (!post.author.equals(req.user._id) && req.user.role === 'user') {
    return next(new ErrorResponse('You are not authorized to alter this resource!', 401));
  }
  post = await Post.findByIdAndUpdate(id, req.body, {
    new: true
  });
  res.send(post);
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) return next(new ErrorResponse(`No post found with ID of ${id}`, 404))
  if (!post.author.equals(req.user._id) && req.user.role === 'user') { 
    return next(new ErrorResponse('You are not authorized to delete this resource!', 401));
  }
  post = await Post.findByIdAndDelete(id);
  res.send(post);
});