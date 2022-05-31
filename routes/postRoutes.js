const express = require('express');
const { checkAuthentication } = require('../utils/auth');
const { posts_get, post_get, posts_post, post_put, post_delete } = require('../controllers/postController');

const postRouter = express.Router();

postRouter.get('/', posts_get);
postRouter.post('/', checkAuthentication, posts_post);
postRouter.get('/:id', post_get);
postRouter.put('/:id', checkAuthentication, post_put);
postRouter.delete('/:id', checkAuthentication, post_delete);

module.exports = postRouter;