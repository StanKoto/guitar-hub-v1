const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Post } = require('../models/Post');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please rate the post before submitting your vote'],
    enum: { values: [1, 2, 3, 4, 5], message: '{VALUE} is not supported, only integers from 1 to 5 are accepted' }
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Post
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
}, 
{
  timestamps: true
});

RatingSchema.index({ post: 1, reviewer: 1 }, { unique: true });

RatingSchema.statics.getAverageRating = async function(postId) {
  const aggregationResults = await this.aggregate([
    {
      $match: { post: postId }
    },
    {
      $group: {
        _id: '$post',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Post').findByIdAndUpdate(postId, {
      averageRating: aggregationResults[0].averageRating
    });
  } catch {
    console.error(err);
  }
};

RatingSchema.post('save', function () {
  this.constructor.getAverageRating(this.post);
});

RatingSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.post);
});

exports.Rating = mongoose.model('rating', RatingSchema);