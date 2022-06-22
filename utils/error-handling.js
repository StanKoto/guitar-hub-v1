class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

handleErrors = (err, req, res, next) => {
  let errors = { username: '', email: '', password: '', title: '', contents: '', rating: '', credentials: '' };

  if (err.code === 11000) {
    if ('post' in err.keyValue && 'reviewer' in err.keyValue) {
      errors.rating = 'You have already rated this post';
    } else {
      errors[Object.keys(err.keyValue)[0]] = `That ${Object.keys(err.keyValue)[0]} is already registered`;
    }
    return res.status(400).json({ errors });
  }

  if (err.name === 'ValidationError') {
    for ({ properties } of Object.values(err.errors)) {
      errors[properties.path] = properties.message;
    }
    return res.status(400).json({ errors });
  }
  
  if (err.name === 'CastError') err = new ErrorResponse(`Resource not found with ID of ${err.value}`, 404)

  if (err.message === 'Invalid credentials') {
    errors.credentials = 'Invalid credentials, please check your email and password and try again';
    return res.status(400).json({ errors });
  }
  
  if (err.message === 'Invalid password') {
    errors.credentials = 'Incorrect password, please try again';
    return res.status(400).json({ errors });
  }

  if (err.message === 'Own post rated') {
    errors.ownPost = 'You cannot rate your own posts';
    return res.status(401).json({ errors });
  }

  if (err.statusCode) return res.status(err.statusCode).render(`errorViews/${err.statusCode.toString()}`, { title: err.statusCode.toString(), message: err.message })

  console.error(err);
  res.status(500).render('errorViews/500', { title: '500'});
};

module.exports = { ErrorResponse, handleErrors };