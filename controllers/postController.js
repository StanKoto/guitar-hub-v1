const slugify = require('slugify');
const { Post } = require('../models/Post');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.posts_get = asyncHandler(async (req, res, next) => {
  res.render('postViews/getPosts', { title: 'Posts', posts: res.searchResults });
});

exports.createPost_get = asyncHandler((req, res, next) => {
  res.render('postViews/createPost', { title: 'Create new post' });
});

exports.posts_post = asyncHandler(async (req, res, next) => {
  const dataToInsert = { title: req.body.title, contents: req.body.contents, author: req.user._id }
  const post = await Post.create(dataToInsert);
  res.status(201).json({ post });
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('author');
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  res.render('postViews/getPost', { title: post.title, post });
});

exports.updatePost_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  res.render('postViews/updatePost', { title: post.title, contents: post.contents });
});

exports.post_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  if ((!post.author || post.author && !post.author.equals(req.user._id)) && req.user.role === 'user') {
    throw new ErrorResponse('You are not authorized to alter this resource!', 401);
  }
  const fieldsToUpdate = { title: req.body.title, contents: req.body.contents };
  if (req.body.title) fieldsToUpdate.slug = slugify(req.body.title, { lower: true })
  post = await Post.findByIdAndUpdate(id, fieldsToUpdate, {
    runValidators: true,
    new: true
  });
  res.status(200).json({ post });
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  if ((!post.author || post.author && !post.author.equals(req.user._id)) && req.user.role === 'user') { 
    throw new ErrorResponse('You are not authorized to delete this resource!', 401);
  }
  await post.remove();
  res.status(200).json({ success: true });
});