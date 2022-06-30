const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please rate the post before submitting your vote'],
    enum: { values: [1, 2, 3, 4, 5], message: '{VALUE} is not supported, only integers from 1 to 5 are accepted' }
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, 
{
  timestamps: true
});

ratingSchema.index({ post: 1, reviewer: 1 }, { unique: true });

ratingSchema.statics.getAverageRating = async function(postId) {
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

  const averageRating = aggregationResults.length !== 0 ? aggregationResults[0].averageRating.toFixed(1) : 0;

  try {
    await this.model('Post').findByIdAndUpdate(postId, { averageRating });
  } catch (err) {
    console.error(err);
  }
};

ratingSchema.post('save', function () {
  this.constructor.getAverageRating(this.post);
});

ratingSchema.post('remove', function () {
  this.constructor.getAverageRating(this.post);
});

exports.Rating = mongoose.model('Rating', ratingSchema);