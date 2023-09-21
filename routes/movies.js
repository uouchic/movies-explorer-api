const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/movies');

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(300),
      director: Joi.string().required().min(2).max(300),
      duration: Joi.number().required().min(2),
      year: Joi.string().required().min(2).max(30),
      description: Joi.string().required().min(2),
      image: Joi.string().required().min(2).uri()
        .pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([a-z]{2,6})))(:\d{2,5})?((\/.+)+)?\/?#?/),
      trailerLink: Joi.string().required().min(2).uri()
        .pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([a-z]{2,6})))(:\d{2,5})?((\/.+)+)?\/?#?/),
      thumbnail: Joi.string().required().min(2).uri()
        .pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([a-z]{2,6})))(:\d{2,5})?((\/.+)+)?\/?#?/),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2),
      nameEN: Joi.string().required().min(2),
    }),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

router.get('/movies', getMovies);

router.use(errors());

module.exports = router;
