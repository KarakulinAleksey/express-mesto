const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequesError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const EmailError = require('../errors/email-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequesError('Переданы некорректные данные при поиске пользователя.'));
      } else {
        next(err);
      }
    });
};

const getAuthUser = (req, res, next) => { // 15
  const authUserId = req.user._id;
  return User.findById(authUserId).orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден.'));
      // } else if (err.name === 'CastError') {
        // next(new BadRequesError('Переданы некорректные данные при поиске пользователя.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  console.log('createUser', req.body);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      // if (err.name === 'MongoServerError' && err.code === 11000) {
      if (err.code === 11000) {
        next(new EmailError('При регистрации указан email, который уже существует на сервере.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequesError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({ message: 'Логин прошел успешно' });
    })
    .catch(() => next(new UnauthorizedError('Неправильная почта или пароль.')));
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true, // 15s
  }).status(200).send({ message: 'Токен удалён' });
};

const updateProfileUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequesError('Переданы некорректные данные при обновлении пользователя.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

const updateAvatarUser = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequesError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getAuthUser,
  createUser,
  login,
  logout,
  updateProfileUser,
  updateAvatarUser,
};
