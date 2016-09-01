'use strict';

var router = require('express').Router();

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');
var Story = require('../stories/story.model');


router.param('id', function (req, res, next, id) {
  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});


router.get('/', function (req, res, next) {

  User.findAll({})
  .then(function (users) {
    res.json(users);
  })
  .catch(next);

});

router.post('/', function (req, res, next) {
  User.create(req.body)
  .then(function (user) {
    res.status(201).json(user);
  })
  .catch(next);
});

router.get('/:id', function (req, res, next) {

  req.requestedUser.reload({include: [Story]})
  .then(function (requestedUser) {
    res.json(requestedUser);
  })
  .catch(next);

});

router.put('/:id', function (req, res, next) {
  if(req.requestedUser.isAdmin || req.requestedUser.id === req.params.id){
  req.requestedUser.update(req.body)
  .then(function (user) {
    res.json(user);
  })
  .catch(next);
} else {
  res.sendStatus(403);
}
});

router.delete('/:id', function (req, res, next) {
  // console.log(req.requestedUser.isAdmin || req.requestedUser.id === req.params.id);
  if(req.requestedUser.isAdmin || req.requestedUser.id === req.params.id){
  req.requestedUser.destroy()
  .then(function () {
    res.status(204).end();
  })
  .catch(next);
} else {
  res.sendStatus(403);
}

});

module.exports = router;
