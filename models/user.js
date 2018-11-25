const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: Boolean,
});

userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods = {
  generateAuthToken: function() {
    return jwt.sign(
      { id: this._id, isAdmin: this.isAdmin },
      config.get('jwtPrivateKey'),
    );
  },
};

userSchema.statics = {
  validatePassword: function(_in, _out) {
    return bcrypt.compare(_in, _out);
  },
};

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(user, schema);
}

function validateRegister(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(user, schema);
}

module.exports = {
  User: mongoose.model('User', userSchema),
  validateUser,
  validateRegister,
};
