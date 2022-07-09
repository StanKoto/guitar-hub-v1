const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [ true, 'Please provide a post title' ],
    maxLength: [ 50, 'Maximum title length is 50 characters' ]
  },
  slug: String,
  contents: {
    type: String,
    required: [ true, 'Please enter some post contents' ],
    maxLength: [ 5000, 'Maximum contents length is 5000 characters' ]
  },
  category: {
    type: String,
    enum: [ 'Guitar, strings and accessories choice', 'Care and maintenance', 'Recording and amplification', 'Other topics' ],
    required: [ true, 'Please choose a category for your post' ]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  averageRating: {
    type: Number
  },
  images: {
    type: [ Buffer ],
    select: false,
    validate: [ arrayLimit, 'The number of {PATH} attached to the post would exceeed the limit of 10, please select less images or delete some of the already attached ones' ]
  }
},
{
  timestamps: true
});

function arrayLimit(val) {
  return val.length <= 10;
};

postSchema.index({ title: 'text', contents: 'text' });

postSchema.statics.getPostCount = async function (authorId) {
  const aggregationResults = await this.aggregate([
    {
      $match: { author: authorId }
    },
    {
      $group: {
        _id: null,
        postCount: {$count: { }}
      }
    }
  ]);

  const postCount = aggregationResults.length !== 0 ? aggregationResults[0].postCount : 0;

  try {
    await this.model('User').findByIdAndUpdate(authorId, { postCount });
  } catch (err) {
    console.error(err);
  }
};

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

postSchema.post('save', function () {
  this.constructor.getPostCount(this.author);
});

postSchema.post('remove', function () {
  this.constructor.getPostCount(this.author);
});

postSchema.pre('remove', async function () {
  await this.model('Rating').deleteMany({ post: this._id });
});


exports.Post = mongoose.model('Post', postSchema);