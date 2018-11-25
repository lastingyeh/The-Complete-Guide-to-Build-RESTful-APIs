const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = {
  genreSchema,
  Genre: mongoose.model('Genre', genreSchema),
  validateGenre,
};
