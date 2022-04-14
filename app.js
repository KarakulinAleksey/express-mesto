require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // 15
// const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');
const errorRoutes = require('./middlewares/error-routes');
const cors = require('./middlewares/cors'); // 15
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  loginValidator,
  createUserValidator,
} = require('./validators/celebrate-validators');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Mongo_OK'))
  .catch((e) => console.log(e));

app.use(cors); // 15
app.use(bodyParser.json());
app.use(cookieParser()); // 15
app.use(requestLogger); // 15

app.get('/crash-test', () => { // 15
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use(routerUsers);
app.use(routerCards);
app.use(errorRoutes);
app.use(errorLogger); // 15
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listing on port ${PORT}`);
});
