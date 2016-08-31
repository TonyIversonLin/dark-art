'use strict';

var Sequelize = require('sequelize');
var data = require('./auth/data.json');

var databaseURI = data.databaseURI;

var db = new Sequelize(databaseURI, {
  define: {
    timestamps: false,
    underscored: true
  }
});

module.exports = db;
