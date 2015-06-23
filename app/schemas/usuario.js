var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idValidator = require('mongoose-id-validator');

var UsuarioSchema = new mongoose.Schema({
    nomeCompleto: {type: String, required: true},
    nomeUsuario: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true, min: 8},
    nascimento: {type: Date, required: true},
    token: {type: String},
    genero: {type: String, match: /^(masculino|feminino)$/, required: true},
    imagemPerfil: {type: String, required: true}
});

UsuarioSchema.plugin(idValidator);

mongoose.exports = mongoose.model('Usuario', UsuarioSchema);
