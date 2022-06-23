const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Post } = require('./models/Post');
const { User } = require('./models/User');
const { Rating } = require('./models/Rating');

dotenv.config({ path: path.join(__dirname, 'config.env') });
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/posts.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
const ratings = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/ratings.json'), 'utf-8'));

const insertData = async () => {
  await Post.create(posts);
  await User.create(users);
  await Rating.create(ratings);
  console.log('Data inserted!');
  process.exit();
};

const deleteData = async () => {
  await Post.deleteMany();
  await User.deleteMany();
  await Rating.deleteMany();
  console.log('Data deleted!');
  process.exit();
};

mongoose.connect(process.env.MONGO_URI)
  .then(res => {
    if (process.argv[2] === '-i') {
      insertData();
    } else if (process.argv[2] === '-d') {
      deleteData();
    }
  })
  .catch(err => console.error(err));