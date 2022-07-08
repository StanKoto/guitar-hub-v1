const express = require('express');
const { searchResults } = require('../middleware/searchResults');
const { Rating } = require('../models/Rating');
const { ratings_get, ratings_post } = require('../controllers/ratingController');

const ratingRouter = express.Router({ mergeParams: true });

ratingRouter.route('/')
  .get(searchResults(Rating, [
  { 
    path: 'post', 
    select: 'title' 
  }, 
  { 
    path: 'reviewer', 
    select: 'username'
   },
  { 
    path: 'recipient', 
    select: 'username'
  }
]), ratings_get)
  .post(ratings_post);

module.exports = ratingRouter;