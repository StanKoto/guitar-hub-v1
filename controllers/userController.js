const { User } = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/error-handling');

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.render('userViews/users', { users, title: 'Users' });
});

exports.users_post = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).send(user);
});

exports.user_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.render('userViews/user', { user, title: user.username });
});

exports.user_put = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.send(user);
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ErrorResponse(`No user found with ID of ${id}`, 404)
  res.json({ user });
});