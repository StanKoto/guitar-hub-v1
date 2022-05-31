class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

handleErrors = (err, req, res, next) => {
  let error = { ...err };
  let errors = { username: '', email: '', password: '' };

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

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with ID of ${err.value}`, 404);
  }

  res.status(error.statusCode || 500).render(error.statusCode ? error.statusCode.toString() : '500');
};

module.exports = { ErrorResponse, handleErrors };