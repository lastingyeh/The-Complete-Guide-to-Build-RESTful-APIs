const { Customer, validateCustomer: validate } = require('../models/customer');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name');
    res.send(customers);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = await new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    }).save();

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true },
    );

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
