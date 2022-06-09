class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

handleErrors = (err, req, res, next) => {
  let errors = { username: '', email: '', password: '', title: '', contents: '' };

  if (err.message === 'Incorrect email') {
    errors.email = 'That email is not registered';
    return res.status(400).json({ errors });
  }
  
  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
    return res.status(400).json({ errors });
  }

  if (err.code === 11000) {
    errors[Object.keys(err.keyValue)[0]] = `That ${Object.keys(err.keyValue)[0]} is already registered`;
    return res.status(400).json({ errors });
  }

  if (err.name === 'ValidationError') {
    for ({ properties } of Object.values(err.errors)) {
      errors[properties.path] = properties.message;
    }
    return res.status(400).json({ errors });
  }

  if (err.name === 'CastError') err = new ErrorResponse(`Resource not found with ID of ${err.value}`, 404)

  if (err.statusCode) return res.status(err.statusCode).render(`errorViews/${err.statusCode.toString()}`, { title: err.statusCode.toString(), message: err.message })

  console.error(err);
  res.status(500).render('errorViews/500', { title: '500'});
};

module.exports = { ErrorResponse, handleErrors };