const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const config = require('./envVariables');
const { checkUser } = require('./middleware/auth');
const authRouter = require('./routes/authRoutes');
const tipRouter = require('./routes/tipRoutes');
const userRouter = require('./routes/userRoutes');
const errorRouter = require('./routes/errorRoutes');
const mainRouter = require('./routes/mainRoutes');
const { handleErrors } = require('./utils/errorHandling');

const app = express();
const PORT = config.main.port || 3000;

mongoose.connect(config.db.mongoUri)
  .then(res => {
    console.log('MongoDB successfully connected');
    app.listen(PORT, console.log(`Listening on port ${PORT}`));
  })
  .catch(err => console.error(err));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: config.session.secret,
  store: MongoStore.create({ mongoUrl: config.db.mongoUri }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: config.session.cookieMaxAge
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}
app.use(session(sessionOptions));

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: config.limiter.windowMS,
  max: config.limiter.max
});

app.use(limiter);
app.use(hpp());
app.use(cors());

app.use(checkUser);
app.use('/auth', authRouter);
app.use('/tips-overview', tipRouter);
app.use('/user-management', userRouter);
app.use('/errors', errorRouter);
app.use(mainRouter);
app.use(handleErrors);