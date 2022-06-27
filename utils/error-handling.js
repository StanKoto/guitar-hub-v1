class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

handleErrors = (err, req, res, next) => {
  let errors = { username: '', email: '', password: '', title: '', contents: '', images: '', rating: '', credentials: '' };

  if (err.code === 11000) {
    if ('post' in err.keyValue && 'reviewer' in err.keyValue) {
      errors.rating = 'You have already rated this post';
    } else {
      errors[Object.keys(err.keyValue)[0]] = `That ${Object.keys(err.keyValue)[0]} is already registered`;
    }
    return res.status(400).json({ errors });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    errors.images = 'The number of selected images exceeeds the limit of 10, please select less images';
    return res.status(400).json({ errors });
  }

  if (err.name === 'ValidationError') {
    for ({ properties } of Object.values(err.errors)) {
      errors[properties.path] = properties.message;
    }
    return res.status(400).json({ errors });
  }
  
  if (err.name === 'CastError') err = new ErrorResponse(`Resource not found with ID of ${err.value}`, 404)

  if (err.statusCode) {
    if (req.method === 'GET') {
      return res.status(err.statusCode).render(`errorViews/${err.statusCode.toString()}`, { title: err.statusCode.toString(), message: err.message });
    }
    return res.status(err.statusCode).json({ otherErrors: true, message: err.message });
  }

  switch (err.message) {
    case 'Invalid credentials':
      errors.credentials = 'Invalid credentials, please check your email and password and try again';
      return res.status(400).json({ errors });
    case 'Invalid password':
      errors.credentials = 'Incorrect password, please try again';
      return res.status(400).json({ errors });
    case 'Own post rated':
      errors.ownPost = 'You cannot rate your own posts';
      return res.status(401).json({ errors });
    case 'Not an image':
      errors.images = 'Please select only image files formatted as JPEG or PNG';
      return res.status(400).json({ errors });
    case 'Duplicate image':
      errors.images = 'You have already uploaded one or more of these images, please sort the duplicates out and try again';
      return res.status(400).json ({ errors });
    default:
      console.error(err);
      if (req.method === 'GET') return res.status(500).redirect('/server-error');
      res.status(500).json({ otherErrors: true });
  }
};

module.exports = { ErrorResponse, handleErrors };