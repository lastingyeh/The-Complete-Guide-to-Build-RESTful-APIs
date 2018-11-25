const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = require('express').Router();

const { Rental, validateRental: validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0)
      return res.status(400).send('Movie not in stock.');

    const rental = await new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    // create transaction
    await new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    // movie.numberInStock--;
    // movie.save();

    res.send(rental);
  } catch (error) {
    res.status(500).send('something wrong for creating rentals');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
      return res
        .status(404)
        .send('The rental with the given ID was not found.');

    res.send(rental);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
