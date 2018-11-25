const router = require('express').Router();
const _ = require('lodash');

const { User, validateUser: validate } = require('../models/user');
const auth = require('../middleware/auth');

// get me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (user) return res.status(400).send('user email was registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    await user.save();

    const token = user.generateAuthToken();

    res
      .header('x-auth-token', token)
      .status(201)
      .send(_.pick(user, ['_id', 'name', 'email']));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
