'use strict';

var router = require('express').Router();
var session = require('express-session');
var passport = require('passport');
var data = require('../auth/.data.json');
var bodyParser = require('body-parser');
var User = require('../api/users/user.model');
var expressSanitized = require('express-sanitized');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(expressSanitized());

// router.use(function (req, res, next) {
//   var bodyString = '';
//   req.on('data', function (chunk) {
//     bodyString += chunk;
//   });
//   req.on('end', function () {
//     bodyString = bodyString || '{}';
//     req.body = eval('(' + bodyString + ')');
//     next();
//   });
// });

router.use(session({
  secret: data.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(done);
});

router.use(passport.initialize());

router.use(passport.session());

module.exports = router;
