const express = require('express');
const { auth_get, login_get, login_post, logout_get, signup_get, signup_post, update_get, updateDetails_put, updatePassword_put } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/',auth_get);
authRouter.get('/login', login_get);
authRouter.post('/login', login_post);
authRouter.get('/logout', logout_get);
authRouter.get('/signup', signup_get);
authRouter.post('/signup', signup_post);
authRouter.get('/update-details', update_get);
authRouter.put('/update-details', updateDetails_put);
authRouter.put('/update-password', updatePassword_put);

module.exports = authRouter;