const { Post } = require('../models/Post');
const { asyncHandler, checkAuthorship, checkUserStatus, checkResource, processImages } = require('../utils/helperFunctions');
const { ErrorResponse } = require('../utils/errorHandling');

exports.posts_get = asyncHandler(async (req, res, next) => {
  res.render('postViews/getPosts', { title: 'Posts', data: res.searchResults, path: req.path });
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post, '+images', { path: 'author', select: 'username slug' });
  res.render('postViews/getPost', { title: post.title, post, path: req.baseUrl + req.path });
});

exports.createPost_get = asyncHandler((req, res, next) => {
  res.render('postViews/createPost', { title: 'Create new post' });
});

exports.posts_post = asyncHandler(async (req, res, next) => {
  const images = [];
  await processImages(req, images);
  const post = await Post.create({ title: req.body.title, contents: req.body.contents, author: req.user._id, images });
  await checkUserStatus(req);
  res.status(201).json({ post });
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post);
  checkAuthorship(req, post);
  await post.remove();
  res.status(200).json({ success: true });
});

exports.updatePost_get = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post, '+images');
  res.render('postViews/updatePost', { title: 'Update post', post });
});

exports.post_put = asyncHandler(async (req, res, next) => {
  let post = await checkResource(req, Post);
  checkAuthorship(req, post);
  post.title = req.body.title;
  post.contents = req.body.contents;
  await post.save();
  res.status(200).json({ post });
});

exports.postImages_post = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post, '+images');
  await processImages(req, post.images);
  await post.save();
  res.status(200).json({ success: true });
});

exports.postImages_delete = asyncHandler(async (req, res, next) => {
  const post = await checkResource(req, Post, '+images');
  if (!post.images) throw new ErrorResponse(`No images found for post with id of ${id}`, 404)
  post.images.splice(req.params.index, 1);
  await post.save();
  res.status(200).json({ success: true });
});