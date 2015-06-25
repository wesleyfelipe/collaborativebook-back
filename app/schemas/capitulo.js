var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idValidator = require('mongoose-id-validator');

var CapituloSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    indice: {type: Number, required: true},
    texto: {type: String, required: true},
    aprovado: {type: Boolean, default: false},
    autor: {type: Schema.ObjectId, ref: 'Usuario', required:true},
    livro: {type: Schema.ObjectId, ref: 'Livro', required: true}
});

CapituloSchema.plugin(idValidator);

mongoose.exports = mongoose.model('Capitulo', CapituloSchema);