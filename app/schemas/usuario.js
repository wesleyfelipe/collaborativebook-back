var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new mongoose.Schema({
    nomeCompleto: {type: String, required: true},
    nomeUsuario: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true, min: 8},
    nascimento: {type: Date, required: true},
    genero: {type: String, match: /^(masculino|feminino)$/, required: true},
    imagemPerfil: {type: String, required: true}
});

mongoose.exports = mongoose.model('Usuario', UsuarioSchema);
