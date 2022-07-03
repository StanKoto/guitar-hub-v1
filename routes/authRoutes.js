const express = require('express');
const { checkAuthentication } = require('../middleware/auth');
const { 
  auth_get, 
  signup_get, 
  signup_post, 
  login_get, 
  login_post,
  forgotPassword_get,
  forgotPassword_post, 
  resetPassword_get,
  resetPassword_put,
  update_get, 
  updateDetails_put, 
  updatePassword_put, 
  logout_get
} = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/',auth_get);
authRouter.route('/signup')
  .get(signup_get)
  .post(signup_post);
authRouter.route('/login')
  .get(login_get)
  .post(login_post);
authRouter.route('/forgotpassword')
  .get(forgotPassword_get)
  .post(forgotPassword_post);
authRouter.route('/resetpassword/:resetToken')
  .get(resetPassword_get)
  .put(resetPassword_put);
authRouter.use(checkAuthentication);
authRouter.get('/update', update_get);
authRouter.put('/update-details', updateDetails_put);
authRouter.put('/update-password', updatePassword_put);
authRouter.get('/logout', logout_get);

module.exports = authRouter;