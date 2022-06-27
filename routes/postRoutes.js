const express = require('express');
const multer = require('multer');
const { Post } = require('../models/Post');
const { checkAuthentication } = require('../utils/auth');
const { searchResults } = require('../utils/searchResults');
const { posts_get, createPost_get, posts_post, post_get, postImages_post, postImages_delete, updatePost_get, post_put, post_delete } = require('../controllers/postController');

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return cb(new Error('Not an image'));
    }
    cb(undefined, true);
  }
});

const postRouter = express.Router();

postRouter.get('/', searchResults(Post, { path: 'author', select: 'username role' }), posts_get);
postRouter.get('/create-post', checkAuthentication, createPost_get);
postRouter.post('/', checkAuthentication, upload.array('images', 10), posts_post);
postRouter.get('/:id/:slug', post_get);
postRouter.post('/:id/images', checkAuthentication, upload.array('images', 10), postImages_post)
postRouter.delete('/:id/images/:index', checkAuthentication, postImages_delete);
postRouter.get('/:id/:slug/update-post', checkAuthentication, updatePost_get);
postRouter.put('/:id', checkAuthentication, post_put);
postRouter.delete('/:id', checkAuthentication, post_delete);

module.exports = postRouter;