const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt; // 15
  // console.log('auth req.cookies.jwt', req.cookies.jwt);
  if (!token) { // 15
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key');
    // console.log('authPayload', payload);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
  // return true;
};
