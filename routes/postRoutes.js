const express = require('express');
const multer = require('multer');
const { checkAuthentication } = require('../middleware/auth');
const { searchResults } = require('../middleware/searchResults');
const { Post } = require('../models/Post');
const { posts_get, post_get, createPost_get, posts_post, postImages_post, postImages_delete, updatePost_get, post_put, post_delete } = require('../controllers/postController');

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

postRouter.get('/', searchResults(Post, { path: 'author', select: 'username' }), posts_get);
postRouter.get('/:id/:slug', post_get);
postRouter.use(checkAuthentication);
postRouter.get('/create-post', createPost_get);
postRouter.post('/', upload.array('images', 10), posts_post);
postRouter.post('/:id/images', upload.array('images', 10), postImages_post)
postRouter.delete('/:id/images/:index', postImages_delete);
postRouter.get('/:id/:slug/update-post', updatePost_get);
postRouter.route('/:id')
  .put(post_put)
  .delete(post_delete);

module.exports = postRouter;