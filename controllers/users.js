const bcrypt = require('bcrypt');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const saltRounds = 10;
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-errors');

// Регистрация пользователя

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email })

    .then((admin) => {
      if (admin) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } else {
        return bcrypt.hash(password, saltRounds)
          .then((hash) => User.create({
            name, email, password: hash,
          }));
      }
    })
    .then((newUser) => res.status(201).send({
      name: newUser.name,
      email: newUser.email,
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не создан, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

// Авторизация пользователя

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        throw new UnauthorizedError('Пользователя с таким email не существует');
      } else {
        bcrypt.compare(password, admin.password, (err, isPasswordMatch) => {
          if (!isPasswordMatch) {
            return next(new UnauthorizedError('Неправильный пароль'));
          }

          const token = jwt.sign({ id: admin._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

          return res.status(200).send({ token });
        });
      }
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не найден, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

// возвращает информацию о пользователе

const getCurrentUser = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Пользователь не найден, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

// обновляет информацию о пользователе

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((updateUserData) => res.status(200).send(updateUserData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не обновлен, переданы невалидные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const delCookieToken = (req, res) => {
  res.clearCookie('jwt', { secure: true, httpOnly: true });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
  delCookieToken,
};
