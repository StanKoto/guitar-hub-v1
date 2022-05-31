const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a post title'],
    maxLength: [50, 'Maximum title length is 50 characters']
  },
  contents: {
    type: String,
    required: true,
    maxLength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
});

exports.Post = mongoose.model('Post', PostSchema);