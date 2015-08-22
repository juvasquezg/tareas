'use strict';

/**
 * Dependencies
 */
var app = require('express')();

app.get('/', function (req, res) {
  res.render('index');
});


module.exports = app;