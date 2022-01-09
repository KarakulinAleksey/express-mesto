const Card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка запрос getCards' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete(cardId).orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданны некорректные данные при удалении карточки.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка запрос deleteCard' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return res
        .status(ERROR_CODE_500)
        .send({ message: 'На сервере произошла ошибка запрос createCard' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true }).orFail()
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка запрос likeCard' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true }).orFail()
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      if (err.name === 'DocumentNotFoundError') return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      // if (err.name === 'CastError') return res.status(ERROR_CODE_404)
      // .send({ message: 'Передан несуществующий _id карточки.' });

      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка запрос dislikeCard' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
