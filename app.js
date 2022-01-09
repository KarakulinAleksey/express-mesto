const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Mongo_OK'))
  .catch((e) => console.log(e));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61d6b6945cac41328844ed07',
  };
  next();
});

app.use(routerUsers);
app.use(routerCards);

app.listen(PORT, () => {
  console.log(`App listing on port ${PORT}`);
});
