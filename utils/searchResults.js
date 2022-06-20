exports.searchResults = (model, populate) => async (req, res, next) => {
  let results;
  const query = { ...req.query };
  const excludedFields = [ 'select', 'sort', 'page', 'limit' ];
  for (param of excludedFields) {
    delete query[param];
  }
  const queryString = JSON.stringify(query).replace(/b\gt|gte|lt|lte|in\b/g, match => `$${match}`);
  const adjustedQuery = JSON.parse(queryString);
  results = model.find(adjustedQuery);
  if (req.query.select) results = results.select(req.query.select.split(',').join(' '))
  if (populate) results = results.populate(populate);
  if (req.query.sort) {
    results = results.sort(req.query.sort.split(',').join(' '));
  } else {
    results = results.sort('-createdAt');
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  results = await results.skip(startIndex).limit(limit);

  const pagination = {};
  if (startIndex > 0) pagination.prev = { page: page - 1, limit }
  if (endIndex < total) pagination.next = { page: page + 1, limit }

  res.searchResults = { results, pagination };

  next();
};