// const https = require('https');
// const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const mainRouter = require('./routes/mainRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');
const { handleErrors } = require('./utils/errorHandling');
const { checkUser } = require('./middleware/auth');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(res => {
    console.log('MongoDB successfully connected');
    // const options = { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') };
    // https.createServer(options, app).listen(PORT, console.log(`Listening on port ${PORT}`));
    app.listen(PORT, console.log(`Listening on port ${PORT}`));
  })
  .catch(err => console.error(err));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(hpp());
app.use(cors());

app.use(checkUser);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/auth', authRouter);
app.use(mainRouter);
app.use(handleErrors);