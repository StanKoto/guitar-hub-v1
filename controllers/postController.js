const slugify = require('slugify');
const sharp = require('sharp');
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
  const images = [];
  const bufferArray = await Promise.all(req.files.map(file => sharp(file.buffer).resize(480, 270).png().toBuffer()));
  for (const buffer of bufferArray) {
    for(const image of images) {
      if (Buffer.compare(buffer, image) === 0) throw new Error ('Duplicate image')
    }
    images.push(buffer);
  }
  const dataToInsert = { title: req.body.title, contents: req.body.contents, author: req.user._id, images }
  await Post.create(dataToInsert);
  res.status(201).json({ success: true });
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).select('+images').populate('author');
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  res.render('postViews/getPost', { title: post.title, post });
});

exports.postImages_post = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).select('+images');
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  const bufferArray = await Promise.all(req.files.map(file => sharp(file.buffer).resize(480, 270).png().toBuffer()));
  for (const buffer of bufferArray) {
    for (const image of post.images) {
      if (Buffer.compare(buffer, image) === 0) throw new Error('Duplicate image')
    }
    post.images.push(buffer);
  }
  await post.save();
  res.status(200).json({ success: true });
});

exports.postImages_delete = asyncHandler(async (req, res, next) => {
  const { id, index } = req.params;
  const post = await Post.findById(id).select('+images');
  if (!post) throw new ErrorResponse(`No post found for with id of ${id}`, 404)
  if (!post.images) throw new ErrorResponse(`No images found for post with id of ${id}`, 404)
  post.images.splice(index, 1);
  await post.save();
  res.status(200).json({ success: true });
});

exports.updatePost_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).select('+images');
  if (!post) throw new ErrorResponse(`No post found with ID of ${id}`, 404)
  res.render('postViews/updatePost', { title: post.title, contents: post.contents, images: post.images });
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