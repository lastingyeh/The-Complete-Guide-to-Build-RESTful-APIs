const router = require('express').Router();

const { User, validateRegister: validate } = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await User.validatePassword(
      req.body.password,
      user.password,
    );

    if (!validPassword)
      return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();

    res.send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
