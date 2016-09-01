'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');
var crypto = require('crypto');




router.post('/login', function (req, res, next) {
  User.findOne({
    attributes: ['salt'],
    where: {
      email: req.body.email
    }
  })
  .then(function(salt){
    console.log('SALT', salt.dataValues.salt);
    var bytes = 64;
    var iterations = 1;
    salt = salt.dataValues.salt;
    console.log('PASSWORD', req.body.password);
    var buffer = crypto.pbkdf2Sync(req.body.password, salt, iterations, bytes, 'sha512');
    console.log('BUFFER', buffer);
    var hash = buffer.toString('base64');
    console.log('HASH', hash);
    return User.findOne({
      where: {
        password: hash
      }
    });
  })
  .then(function (user) {
    if (!user) throw HttpError(401);
    req.login(user, function (err) {
      if (err) next(err);
      else res.json(user);
    });
  })
  .catch(next);
});

router.post('/signup', function (req, res, next) {
  console.log(req.body.password);
  var bytes = 64;
  var salt = crypto.randomBytes(16);
  var iterations = 1;
  var buffer = crypto.pbkdf2Sync(req.body.password, salt, iterations, bytes, 'sha512');
  var hash = buffer.toString('base64');

  User.create({email: req.body.email, password: hash, salt: salt})
  .then(function (user) {
    req.login(user, function (err) {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
});

router.get('/me', function (req, res, next) {
  res.json(req.user);
});

router.delete('/me', function (req, res, next) {
  req.logout();
  res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;
