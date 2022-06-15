const slugify = require('slugify');
const { User } = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

const regenerateSession = (req, res, user) => {
  req.session.regenerate(err => {
    if (err) throw err
    req.session.user = user._id;
    req.session.save(err => {
      if (err) throw err
      res.status(200).json({ user, selfUpdate: true });
    });
  });
};

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.render('userViews/getUsers', { title: 'Users', users });
});

exports.createUser_get = asyncHandler((req, res, next) => {
  res.render('userViews/createUser', { title: 'Create new user' });
});

exports.users_post = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ user } );
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.render('userViews/getUser', { title: user.username, user });
});

exports.updateUser_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.render('userViews/updateUser', { title: 'Update user details', user });
});

exports.userDetails_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.username) {
    req.body.slug = slugify(req.body.username, { lower: true });
  }
  const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  if (user._id.equals(req.user._id)) {
    return regenerateSession(req, res, user);
  }
  res.status(200).json({ user, selfUpdate: false });
});

exports.userPassword_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const adminUser = await User.findById(req.user._id).select('+password');
  if (!adminUser) throw new ErrorResponse(`No user found with id of ${req.user._id}`, 404);
  const isMatch = await adminUser.matchPassword(req.body.adminPassword);
  if (!isMatch) throw new Error('Invalid password');
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`No user found with id of ${id}`,404);
  user.password = req.body.newPassword;
  await user.save();
  if (user._id.equals(req.user._id)) {
    return regenerateSession(req, res, user);
  }
  res.status(200).json({ user, selfUpdate: false });
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.status(200).json({ user });
});