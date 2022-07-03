const crypto = require('crypto');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  slug: String,
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
    select: false
  },
  postCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'passive'],
    default: 'passive'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.slug = slugify(this.username, { lower: true });
});

userSchema.pre('remove', async function () {
  await this.model('Post').updateMany({ author: this._id }, { author: null });
  await this.model('Rating').updateMany({ reviewer: this._id }, { reviewer: null });
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  justOne: false
});

exports.User = mongoose.model('User', userSchema);