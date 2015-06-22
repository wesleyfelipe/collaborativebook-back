var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CapituloSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    indice: {type: Number, required: true},
    texto: {type: String, required: true},
    aprovado: {type: Boolean, default: false},
    autor: {type: Schema.ObjectId, ref: 'Usuario', required:true},
    livro: {type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required:true}
});

mongoose.exports = mongoose.model('Capitulo', CapituloSchema);