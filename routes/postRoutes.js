const express = require('express');
const multer = require('multer');
const { checkAuthentication } = require('../middleware/auth');
const { searchResults } = require('../middleware/searchResults');
const { Post } = require('../models/Post');
const { 
  posts_get, 
  post_get, 
  createPost_get, 
  posts_post, 
  post_delete,
  updatePost_get, 
  post_put, 
  postImages_post, 
  postImages_delete
} = require('../controllers/postController');
const postRatingRouter = require('../routes/postRatingRoutes');

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

postRouter.get('/', searchResults(Post, [{ path: 'author', select: 'username' }]), posts_get);
postRouter.get('/author-posts', searchResults(Post, [{ path: 'author', select: 'username slug' }]), posts_get);
postRouter.get('/:id/:slug', post_get);
postRouter.use(checkAuthentication);
postRouter.route('/create-post')
.get(createPost_get)
.post(upload.array('images', 10), posts_post);
postRouter.delete('/:id/:slug', post_delete);
postRouter.use('/:id/:slug/post-ratings', postRatingRouter);
postRouter.route('/:id/:slug/update-post')
.get(updatePost_get)
.put(post_put);
postRouter.post('/:id/:slug/update-post/images', upload.array('images', 10), postImages_post)
postRouter.delete('/:id/:slug/update-post/images/:index', postImages_delete);

module.exports = postRouter;