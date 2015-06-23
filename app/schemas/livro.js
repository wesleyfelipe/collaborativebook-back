var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LivroSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    genero: {type: String, required: true},
    enredo: {type: String, required: true},
    personagens: {type: String, required: true},
    ambientacao: {type: String, required: true},
    proprietario: {type: Schema.ObjectId, ref: 'usuario', required:false}
});

mongoose.exports = mongoose.model('Livro', LivroSchema);
