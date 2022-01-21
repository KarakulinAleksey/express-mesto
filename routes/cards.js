const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  createCardValidator,
  cardIdValidator,
} = require('../validators/celebrate-validators');

router.get('/cards', getCards);
router.delete('/cards/:cardId', cardIdValidator, deleteCard);
router.post('/cards', createCardValidator, createCard);
router.put('/cards/:cardId/likes', cardIdValidator, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
