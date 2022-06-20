const mongoose = require('mongoose');
const slugify = require('slugify');
const { User } = require('./User');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a post title'],
    maxLength: [50, 'Maximum title length is 50 characters']
  },
  slug: String,
  contents: {
    type: String,
    required: [true, 'Please enter some post contents'],
    maxLength: [5000, 'Maximum contents length is 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
},
{
  timestamps: true
});

PostSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

exports.Post = mongoose.model('Post', PostSchema);