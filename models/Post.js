const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
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
    ref: 'User'
  },
  averageRating: {
    type: Number
  }
},
{
  timestamps: true
});

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

postSchema.pre('remove', async function () {
  await this.model('Rating').deleteMany({ post: this._id });
});


exports.Post = mongoose.model('Post', postSchema);