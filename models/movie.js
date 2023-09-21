const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3000,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3000,
  },
  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 3000,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3000,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3000,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
});

module.exports = mongoose.model('movie', movieSchema);
