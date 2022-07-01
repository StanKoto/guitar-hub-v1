const express = require('express');
const { checkAuthentication, checkRole } = require('../middleware/auth');
const { index_get, guitarTips_get, manageUsers_get, about_get, unauthorized_get, badRequest_get, serverError_get } = require('../controllers/mainController');

const mainRouter = express.Router();

mainRouter.get('/', index_get);
mainRouter.get('/guitar-tips', guitarTips_get);
mainRouter.get('/manage-users', checkAuthentication, checkRole, manageUsers_get);
mainRouter.get('/about', about_get);
mainRouter.get('/unauthorized', unauthorized_get);
mainRouter.get('/bad-request', badRequest_get);
mainRouter.get('/server-error', serverError_get);
mainRouter.get('*', badRequest_get);

module.exports = mainRouter;