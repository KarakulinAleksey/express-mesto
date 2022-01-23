const NotFoundError = require('../errors/not-found-error');

const errorRoutes = (req, res, next) => {
  try {
    throw new NotFoundError('Запрошен не существующий роут.');
  } catch (err) {
    next(err);
  }
  next();
};

module.exports = errorRoutes;
