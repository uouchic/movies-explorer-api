const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-errors');

const createMovie = (req, res, next) => {
  const owner = req.user.id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    image,
    description,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => res.status(201).send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Постер фильма не создан, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с таким id не найден');
      }
      // eslint-disable-next-line eqeqeq
      if (movie.owner == req.user.id) {
        return Movie.findByIdAndRemove(movieId)
          // eslint-disable-next-line no-shadow
          .then((movie) => {
            res.status(200).send(movie);
          });
      }
      throw new ForbiddenError('Можно удалять только свои фильмы');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Фильм не удален, некоректный id фильма'));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
