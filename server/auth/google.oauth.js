'use strict';

var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var data = require('./.data.json');
var clientSecret = data.googleClientSecret;
var clientId = data.googleClientId;


var User = require('../api/users/user.model');

router.get('/', passport.authenticate('google', {
  scope: 'email'
}));

router.get('/callback', passport.authenticate('google', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));

passport.use(new GoogleStrategy({
  clientID: '238524570915-ivf9lnhm9bsfq13cle5ap8s28d4lmhrp.apps.googleusercontent.com',
  clientSecret: clientSecret,
  callbackURL: clientId
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // google may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {googleId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
