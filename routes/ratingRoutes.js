const express = require('express');
const { Rating } = require('../models/Rating');
const { searchResults } = require('../utils/searchResults');
const { checkAuthentication } = require('../utils/auth');
const { ratings_get, ratings_post } = require('../controllers/ratingController');

const ratingRouter = express.Router();
ratingRouter.use(checkAuthentication);

ratingRouter.get('/', searchResults(Rating, { path: 'post', select: 'title' }, { path: 'reviewer', select: 'username' }), ratings_get);
ratingRouter.post('/:postId', ratings_post);

module.exports = ratingRouter;