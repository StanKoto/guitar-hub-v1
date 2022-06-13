const slugify = require('slugify');
const { Post } = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.posts_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('author');
  res.render('postViews/posts', { posts, title: 'Posts' });
});

exports.posts_post = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;
  const post = await Post.create(req.body);
  res.json({ post });
});

exports.createPost_get = asyncHandler((req, res, next) => {
  res.render('postViews/createPost', { title: 'Create a post' });
});

exports.updatePost_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render('postViews/updatePost', { title: post.title, contents: post.contents });
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('author');
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  res.render('postViews/post', { post, title: post.title });
});

exports.post_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  if (!post.author.equals(req.user._id) && req.user.role === 'user') {
    throw new ErrorResponse('You are not authorized to alter this resource!', 401);
  }
  req.body.slug = slugify(req.body.title, { lower: true });
  post = await Post.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true
  });
  res.json({ post });
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  if (!post.author.equals(req.user._id) && req.user.role === 'user') { 
    throw new ErrorResponse('You are not authorized to delete this resource!', 401);
  }
  post = await Post.findByIdAndDelete(id);
  res.json({ post });
});