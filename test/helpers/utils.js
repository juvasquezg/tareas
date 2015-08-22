var request = require('supertest-as-promised');
var api = require('../../server.js');
var host = process.env.API_TEST_HOST || api;
//var host = 'http://localhost:4200/api';
request = request(host);

module.exports.createTarea = function createTarea(tarea) {
  console.log('create tarea');
  var sample = {
    "tarea": {
      "titulo": "Investigar Design Thinking",
      "estatus": 1
    }
  };

  tarea = tarea || sample;

  return request
    .post('/tareas')
    .set('Accept', 'application/json')
    .send(tarea)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  .then(function getTarea(res) {
    this.tarea = res.body.tarea;
    this.id = res.body.tarea.id;
  }.bind(this));
}
