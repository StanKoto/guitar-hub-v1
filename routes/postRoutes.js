const express = require('express');
const { Post } = require('../models/Post');
const { checkAuthentication } = require('../utils/auth');
const { searchResults } = require('../utils/searchResults');
const { posts_get, createPost_get, posts_post, post_get, updatePost_get, post_put, post_delete } = require('../controllers/postController');

const postRouter = express.Router();

postRouter.get('/', searchResults(Post, { path: 'author', select: 'username role' }), posts_get);
postRouter.get('/create-post', checkAuthentication, createPost_get);
postRouter.post('/', checkAuthentication, posts_post);
postRouter.get('/:id/:slug', post_get);
postRouter.get('/:id/:slug/update-post', checkAuthentication, updatePost_get);
postRouter.put('/:id', checkAuthentication, post_put);
postRouter.delete('/:id', checkAuthentication, post_delete);

module.exports = postRouter;