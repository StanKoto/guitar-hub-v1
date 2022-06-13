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
  status: {
    type: String,
    enum: ['active', 'passive'],
    default: 'passive'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.slug = slugify(this.username, { lower: true });
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

exports.User = mongoose.model('user', userSchema);