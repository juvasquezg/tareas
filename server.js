/**
 * Module dependencies
 */
var express = require('express');
var logger = require('./lib/logger');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var path = require('path');
var swig = require('swig');

/**
 * Locals
 */
var app = module.exports = express();
var port = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.json('application/json'));
app.use(cors());

/**
  * Settings
  */
  // Template engine
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views/');


/**
 * Routes
 */
var root = require('./lib/root')
app.use(root);
var notas = require('./lib/notas');
app.use(notas);
var tareas = require('./lib/tareas');
app.use(tareas);



/**
 * Start server if we're not someone else's dependency
 */
if (!module.parent) {
  mongoose.connect('mongodb://localhost:27017/tareas', function() {
    app.listen(port, function() {
      logger.info('Tareas, API Básico escuchando en http://localhost:%s/', port);
    });
  });
}
