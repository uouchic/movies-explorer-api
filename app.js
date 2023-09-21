const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const cors = require('cors');
const userRouters = require('./routes/users');
const movieRouters = require('./routes/movies');

const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
  delCookieToken,
} = require('./controllers/users');

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose
  .connect(DB_ADDRESS, {
    useNewUrlParser: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Мы подключились к базе данных');
  });

const app = express();

app.use(cors({ origin: '*' }));

app.use(bodyParser.json());

app.use(requestLogger);

// app.get('/api/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/api', userRouters);
app.use('/api', movieRouters);

app.post(
  '/api/signout',
  delCookieToken,
);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
