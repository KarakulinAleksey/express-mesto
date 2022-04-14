const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new Error('URL validation err');
  }
  return value;
};

module.exports.createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidator),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidator),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.updateProfileUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateAvatarUserValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidator),
  }),
});

module.exports.userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});
