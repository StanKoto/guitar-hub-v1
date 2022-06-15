const express = require('express');
const { checkAuthentication, checkRole } = require('../utils/auth');
const { users_get, createUser_get, users_post, user_get, updateUser_get, userDetails_put, userPassword_put, user_delete } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.use(checkAuthentication, checkRole);

userRouter.get('/', users_get);
userRouter.get('/create-user', createUser_get);
userRouter.post('/', users_post);
userRouter.get('/:id/:slug', user_get);
userRouter.get('/:id/:slug/update-user', updateUser_get);
userRouter.put('/:id/update-details', userDetails_put);
userRouter.put('/:id/update-password', userPassword_put);
userRouter.delete('/:id', user_delete);

module.exports = userRouter;