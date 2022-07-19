const express = require('express');
const { searchResults } = require('../middleware/searchResults');
const { Rating } = require('../models/Rating');
const { ratings_get } = require('../controllers/ratingController');

const userRatingRouter = express.Router({ mergeParams: true });

userRatingRouter.get('/given-ratings', searchResults(Rating, [
  { path: 'tip', select: 'title' }, 
  { path: 'reviewer', select: 'username' },
  { path: 'recipient', select: 'username' }
]), ratings_get);

userRatingRouter.get('/received-ratings', searchResults(Rating, [
  { path: 'tip', select: 'title' }, 
  { path: 'reviewer', select: 'username' },
  { path: 'recipient', select: 'username' }
]), ratings_get);

module.exports = userRatingRouter;