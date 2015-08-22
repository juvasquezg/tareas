var request = require('supertest-as-promised');
var api = require('../server.js');
var host = process.env.API_TEST_HOST || api;
var mongoose = require('mongoose');
//var host = 'http://localhost:3000';

var _ = require('lodash');

request = request(host);

describe('Coleccion de Tareas [/tareas]', function () {
  before(function (done) {
    mongoose.connect('mongodb://localhost/tareas', done);
  });

  after(function (done) {
    mongoose.disconnect(done);
    mongoose.models = {};
  });

  describe('POST', function () {
    it('deberia crear una tarea', function (done) {
      var data = {
        "tarea": {
          "titulo": "Limpiar el Baño",
          "estatus": 1,
        }
      };

      request
        .post('/tareas')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .end(function (err, res) {
        var tarea;

        var body = res.body;
        // console.log('body', body);

        // Tarea existe
        expect(body).to.have.property('tarea');
        tarea = body.tarea;

        // Propiedades
        expect(tarea).to.have.property('titulo', 'Limpiar el Baño');
        expect(tarea).to.have.property('estatus', 1);
        expect(tarea).to.have.property('id');

        done(err);
      });
    });
  });

  describe('GET /tareas/:id', function () {
    it('deberia obtener una tarea existente', function (done) {
      var id;
      var data = {
        "tarea": {
          "titulo": "Limpiar el Baño",
          "estatus": 1,
        }
      };

      request
        .post('/tareas')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then(function gettarea(res) {
        id = res.body.tarea.id;

        return request.get('/tareas/' + id)
          .set('Accept', 'application/json')
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then(function assertions(res) {
        var tarea;
        var body = res.body;
        // tarea existe
        expect(body).to.have.property('tareas');
        tarea = body.tareas;

        // Propiedades
        expect(tarea).to.have.property('id', id);
        expect(tarea).to.have.property('titulo', 'Limpiar el Baño');
        expect(tarea).to.have.property('estatus', 1);
        done();
      }, done);
    });
  });

  describe('PUT', function () {
    it.only('deberia actualizar una tarea existente', function (done) {
      var id;
      var data = {
        "tarea": {
          "titulo": "Limpiar el Baño",
          "estatus": 1,
        }
      };

      request
        .post('/tareas')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then(function gettarea(res) {
        var update = {
          "tarea": {
            "id" : res.body.tarea.id,
            "titulo": "Limpiar la Sala",
            "estatus": 0,
          }
        };


        id = res.body.tarea.id;

        return request.put('/tareas/' + id)
          .set('Accept', 'application/json')
          .send(update)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then(function assertions(res) {
        var tarea;
        var body = res.body;

        // tarea existe
        expect(body).to.have.property('tarea');
        expect(body.tarea).to.be.an('array')
          .and.to.have.length(1);
        tarea = body.tarea[0];

        // Propiedades
        expect(tarea).to.have.property('id', id);
        expect(tarea).to.have.property('titulo', 'Limpiar la Sala');
        expect(tarea).to.have.property('estatus', 0);
        done();
      }, done);

    });
  });

  describe('DELETE', function () {
    it('deberia eliminar una tarea existente', function (done) {
      var id;
      var data = {
        "tarea": {
          "titulo": "Limpiar el Baño",
          "estatus": 1,
        }
      };

      request
        .post('/tareas')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then(function deletetarea(res) {

        id = res.body.tarea.id;

        return request.delete('/tareas/' + id)
          .set('Accept', 'application/json')
          .expect(204)
      }, done)
      .then(function assertions(res) {
        var tarea;
        var body = res.body;

        // Respuesta vacia
        expect(body).to.be.empty;

        // Probamos que de verdad no exista
        return request.get('/tareas/' + id)
          .set('Accept', 'application/json')
          .send()
          .expect(400)
      }, done)
      .then(function confirmation(res) {
        var body = res.body;
        expect(body).to.be.empty;
        done();
      }, done);

    });
  });

  describe('GET /tareas/', function () {
    it('deberia obtener todas las tareas existente', function (done) {
      var id1;
      var id2;

      var data1 = {
        "tarea": {
          "titulo": "Limpiar el Baño",
          "estatus": 1,
        }
      };

      var data2 = {
        "tarea": {
          "titulo": "Limpiar la Cocina",
          "estatus": 1,
        }
      };

      request
        .post('/tareas')
        .set('Accept', 'application/json')
        .send(data1)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      .then(function createAnothertarea(res) {
        id1 = res.body.tarea.id;
        return request
          .post('/tareas')
          .set('Accept', 'application/json')
          .send(data2)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      })
      .then(function gettareas(res) {
        id2 = res.body.tarea.id;
        return request.get('/tareas')
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, done)
      .then(function assertions(res) {
        var body = res.body;

        expect(body).to.have.property('tareas');
        expect(body.tareas).to.be.an('array')
          .and.to.have.length.above(2);

        var tareas = body.tareas;

        var tarea1 = _.find(tareas, { id: id1 });
        var tarea2 = _.find(tareas, { id: id2 });

        // Propiedades tarea1
        expect(tarea1).to.have.property('id', id1);
        expect(tarea1).to.have.property('titulo', 'Limpiar el Baño');
        expect(tarea1).to.have.property('estatus', 1);

        // Propiedades tarea1
        expect(tarea2).to.have.property('id', id2);
        expect(tarea2).to.have.property('titulo', 'Limpiar la Cocina');
        expect(tarea2).to.have.property('estatus', 1);

        done();
      }, done);

    });
  });

});
