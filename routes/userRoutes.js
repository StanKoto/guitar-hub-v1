const express = require('express');
const { checkAuthentication, checkRole } = require('../utils/auth');
const { users_get, user_get, users_post, user_put, user_delete } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.use(checkAuthentication, checkRole);

userRouter.get('/', users_get);
userRouter.post('/', users_post);
userRouter.get('/:id', user_get); 
userRouter.put('/:id', user_put);
userRouter.delete('/:id', user_delete);

module.exports = userRouter;