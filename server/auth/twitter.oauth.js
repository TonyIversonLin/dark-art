'use strict';

var router = require('express').Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));

passport.use(new TwitterStrategy({
  consumerKey: 'xe86sGm0HUu7qTwnQBq89dX02',
  consumerSecret: 'pD1XEQgYppFpztd86H14d8EQWR0627yZRrFMP53DSOuMf4YaoQ',
  callbackURL: 'http://127.0.0.1:8080/auth/twitter/callback'
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // twitter may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {twitterId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
