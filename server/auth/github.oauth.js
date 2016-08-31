'use strict';

var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var data = require('./data.json');
var clientSecret = data.githubClientSecret;
var clientId = data.githubClientId;

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));

passport.use(new GitHubStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: 'http://127.0.0.1:8080/auth/github/callback'
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // github may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {githubId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
