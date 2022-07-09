const express = require('express');
const { checkAuthentication, checkRole } = require('../middleware/auth');
const { searchResults } = require('../middleware/searchResults');
const { User } = require('../models/User');
const { 
  users_get, 
  createUser_get, 
  users_post, 
  user_get, 
  user_delete,
  updateUser_get, 
  userDetails_put, 
  userPassword_put 
} = require('../controllers/userController');
const userRatingRouter = require('../routes/userRatingRoutes');

const userRouter = express.Router();

userRouter.use(checkAuthentication, checkRole);

userRouter.get('/', searchResults(User), users_get);
userRouter.route('/create-user')
  .get(createUser_get)
  .post(users_post);
userRouter.route('/:id/:slug')
  .get(user_get)
  .delete(user_delete);
userRouter.use('/:id/:slug/user-ratings', userRatingRouter);
userRouter.get('/:id/:slug/update-user', updateUser_get);
userRouter.put('/:id/:slug/update-user/update-details', userDetails_put);
userRouter.put('/:id/:slug/update-user/update-password', userPassword_put);

module.exports = userRouter;