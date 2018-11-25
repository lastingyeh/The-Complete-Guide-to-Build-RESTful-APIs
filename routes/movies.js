const router = require('express').Router();

const { Movie, validateMovie: validate } = require('../models/movie');
const { Genre } = require('../models/genre');

// Get movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort('name');

    res.send(movies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Post movie
router.post('/', async (req, res) => {
  try {
    // check req.body
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // check genre exists
    const genre = await Genre.findById(req.body.genreId);

    if (!genre) {
      return res.status(400).send('Invalid genre.');
    }

    // create movie & set genre
    const { title, numberInStock, dailyRentalRate } = req.body;

    const movie = await new Movie({
      title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock,
      dailyRentalRate,
    }).save();

    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Put movie
router.put('/:id', async (req, res) => {
  try {
    // check req.body
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // check genre exists
    const genre = await Genre.findById(req.body.genreId);

    if (!genre) {
      return res.status(400).send('Invalid genre.');
    }

    const { title, numberInStock, dailyRentalRate } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        genre: { _id: genre._id, name: genre.name },
        numberInStock,
        dailyRentalRate,
      },
      { new: true },
    );

    if (!movie) {
      return res.status(404).send('The movie with the given ID was not found.');
    }

    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) {
      return res.status(404).send('The movie with the given ID was not found.');
    }

    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
