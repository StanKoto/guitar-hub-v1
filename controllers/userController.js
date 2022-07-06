const { User } = require('../models/User');
const { 
  asyncHandler, 
  regenerateSession, 
  checkPassword, 
  checkResource, 
  checkResourceAndUpdate
} = require('../utils/helperFunctions');
const { ErrorResponse } = require('../utils/errorHandling');

exports.users_get = asyncHandler(async (req, res, next) => {
  res.render('userViews/getUsers', { title: 'Users', users: res.searchResults, url: req.originalUrl });
});

exports.createUser_get = asyncHandler((req, res, next) => {
  res.render('userViews/createUser', { title: 'Create new user' });
});

exports.users_post = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ user } );
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const user = await checkResource(req, User);
  res.render('userViews/getUser', { title: user.username, user });
});

exports.updateUser_get = asyncHandler(async (req, res, next) => {
  const user = await checkResource(req, User);
  res.render('userViews/updateUser', { title: 'Update user details', user });
});

exports.userDetails_put = asyncHandler(async (req, res, next) => {
  const user = await checkResourceAndUpdate(req, User);
  if (user._id.equals(req.user._id)) return regenerateSession(req, res, user)
  res.status(200).json({ user, selfUpdate: false });
});

exports.userPassword_put = asyncHandler(async (req, res, next) => {
  const adminUser = await User.findById(req.user._id).select('+password');
  if (!adminUser) throw new ErrorResponse(`No admin account found with id of ${req.user._id}`, 404);
  await checkPassword(req, adminUser, req.body.adminPassword);
  const user = await checkResource(req, User);
  user.password = req.body.newPassword;
  await user.save();
  if (user._id.equals(req.user._id)) return regenerateSession(req, res, user)
  res.status(200).json({ user, selfUpdate: false });
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  const user = await checkResource(req, User);
  await user.remove();
  res.status(200).json({ success: true });
});