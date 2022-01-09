const User = require('../models/user');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка запрос getUsers' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден.' });
      return res
        .status(ERROR_CODE_500)
        .send({ message: 'На сервере произошла ошибка запрос createUsers' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res
        .status(ERROR_CODE_500)
        .send({ message: 'На сервере произошла ошибка запрос createUsers' });
    });
};

const updateProfileUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден.' });
      return res
        .status(ERROR_CODE_500)
        .send({ message: 'На сервере произошла ошибка запрос createUsers' });
    });
};

const updateAvatarUser = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Пользователь по с указанным не найден.' });

      return res
        .status(ERROR_CODE_500)
        .send({ message: 'На сервере произошла ошибка запрос updateAvatarUser' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfileUser,
  updateAvatarUser,
};
