/**
 * Dependencies
 */
var app = require('express')();
var logger = require('../logger');
var _ = require('lodash');

/**
 * Locals
 */
var db = {};
var Tarea = require('./model');

/**
 * Verbs
 */

app.get('/tareas', function (req, res) {
  console.log('get tareas');
  
  Tarea.find({}).exec()
    .then(function (tareas) {
    
    var tareasFixed = tareas.map(function (tarea) {
      return tarea.toJSON();
    });
    
    res
        .status(200)
        .set('Content-Type', 'application/json')
        .json({
      tareas: tareasFixed
    });
  }, function (err) {
    console.log('err', err);
  })
});

app.route('/tareas/:id?')

  .all(function (req, res, next) {
  console.log(req.method, req.path, req.body);
  res.set('Content-Type', 'application/json');
  next();
})

  // POST
  .post(function (req, res) {
  
  // manipulate request
  var tareaNueva = req.body.tarea;
 
  // save to storage
  Tarea.create(tareaNueva)
      .then(function (tarea) {
    // response
    res
          .status(201)
          .json({
      tarea: tarea.toJSON()
    });
  });
})

  // GET /tareas
  .get(function (req, res, next) {
  var id = req.params.id;
  
  if (!id) {
    console.log('no param');
    return next();
  }
  
  Taea.findById(id, function (err, tarea) {
    if (!tarea) {
      return res
          .status(400)
          .send({});
    }
    
    res.json({
      tareas: tarea
    })
  });

})

  // PUT
  .put(function (req, res, next) {
  var id = req.params.id;
  var tareaActualizada = req.body.tarea;
  
  if (!id) {
    return next();
  }
  
  Tarea.update({ _id: id }, tareaActualizada, function (err, tarea, results) {
    console.log(arguments);
    // response
    if (results.ok) {
      return res
        .json({
          tarea: [tareaActualizada]
        });
    }
    res
        .status(500)
        .send(err);

  });

})

  // DELETE
  .delete(function (req, res) {
  var id = req.params.id;
  
  if (!id) {
    return next();
  }
  
  Tarea.remove({ _id: id }, function () {
    res
        .status(204)
        .send();
  });
});



module.exports = app;