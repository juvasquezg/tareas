var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TareaSchema = new Schema({
  titulo: String,
  estatus: Number
});

TareaSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

var model = mongoose.model('tareas', TareaSchema);

module.exports = model;