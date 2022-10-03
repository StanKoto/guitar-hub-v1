const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./envVariables');
const { User } = require('./models/User');
const { Tip } = require('./models/Tip');
const { Rating } = require('./models/Rating');

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json', 'utf-8')));
const tips = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tips.json', 'utf-8')));
const ratings = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/ratings.json', 'utf-8')));

const insertData = async () => {
  await User.create(users);
  await Tip.create(tips);
  for (const rating of ratings) {
    const newRating = new Rating(rating);
    await newRating.save();
  }
  console.log('Data inserted!');
  process.exit();
};

const deleteData = async () => {
  await User.deleteMany();
  await Tip.deleteMany();
  await Rating.deleteMany();
  console.log('Data deleted!');
  process.exit();
};

mongoose.connect(config.db.mongoUri)
  .then(res => {
    if (process.argv[2] === '-i') {
      insertData();
    } else if (process.argv[2] === '-d') {
      deleteData();
    }
  })
  .catch(err => console.error(err));