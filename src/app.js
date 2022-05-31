const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mainRouter = require('../routes/mainRoutes');
const userRouter = require('../routes/userRoutes');
const postRouter = require('../routes/postRoutes');
const authRouter = require('../routes/authRoutes');
const { handleErrors } = require('../utils/error-handling');

dotenv.config({ path: path.join(__dirname, '../config.env') });

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB successfully connected');

  const app = express();

  app.use(express.static('public'));
  app.set('view engine', 'ejs');

  app.use(express.json());

  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 10800000
    }
  }));

  app.use('/users', userRouter);
  app.use('/posts', postRouter);
  app.use('/auth', authRouter);
  app.use(mainRouter);

  app.use(handleErrors);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, console.log(`Listening on port ${PORT}`));
}) ();