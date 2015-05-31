'use strict';

/*
 * Module dependencies
 */
var application_root = __dirname,
        express = require('express'), // Web framework
        path = require('path'), // file paths
        mongoose = require('mongoose'); // Acesso ao MongoDB


/*
 * Conexão com o banco de dados 
 */
mongoose.connect('mongodb://localhost/colaborativebook');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[ERROR]Erro de conexão:'));


/*
 * Schemas
 */
var Schema = mongoose.Schema;

var usuarioSchema = new mongoose.Schema({
    nomeCompleto: {type: String, required: true},
    nomeUsuario: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true, min: 8},
    nascimento: {type: Date, required: true},
    genero: {type: String, match: /^(masculino|feminino)$/, required: true},
    imagemPerfil: {type: String, required: true}
});

var livroSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    genero: {type: String, required: true},
    enredo: {type: String, required: true},
    personagens: {type: String, required: true},
    ambientacao: {type: String, required: true},
    proprietario: {type: Schema.ObjectId, ref: 'usuario', required:true}
});


/*
 * Models
 */
var usuarioModel = mongoose.model('Usuario', usuarioSchema);
var livroModel = mongoose.model('Livro', livroSchema);


/*
 * Criação e configuração do servidor
 */
var app = express();
app.configure(function () {
    //parses request body and populates request.body
    app.use(express.bodyParser());
    //checks request.body for HTTP method overrides
    app.use(express.methodOverride());
    //perform route lookup based on url and HTTP method
    app.use(app.router);
    //Show all errors in development
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});


/*
 * Rotas
 */

//------------------- USUÁRIOS -----------------------------

//Criação de novo usuário
app.post('/api/usuarios', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[INFO]POST em /api/usuarios");
    var usuario = new usuarioModel({
        nomeCompleto: request.body.nomeCompleto,
        nomeUsuario: request.body.nomeUsuario,
        email: request.body.email,
        senha: request.body.senha,
        nascimento: request.body.nascimento,
        genero: request.body.genero,
        imagemPerfil: 'assets/img/default_avatar.png'
    });
    usuario.save(function (err) {
        if (err) {
            switch (err.name) {
                case 'ValidationError':
                    console.log('[WARN]Erro ao criar usuário: ' + err);
                    response.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar usuário: ' + err);
                    switch (err.code) {
                        case 11000:
                            response.statusCode = 409;
                            break;
                        default:
                            response.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar usuário: ' + err);
                    response.statusCode = 500;
            }
            return response.send("Erro ao criar usuário: " + err);
        }
        console.log('[INFO]Usuário ' + usuario.nomeUsuario + ' criado com sucesso.');
        response.statusCode = 201;
        return response.send(usuario);
    });
});

//Recuperação de um usuário
app.get('/api/usuarios/:id', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/usuarios. ID buscado: ' + request.params.id + '.');
    return usuarioModel.findById(request.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                console.log('[INFO]Usuário ' + request.params.id + ' recuperado com sucesso.');
                response.statusCode = 200;
                return response.send(usuario);
            }
            console.log('[WARN]Usuário ' + request.params.id + ' não encontrado.');
            response.statusCode = 404;
            return response.send('Usuário ' + request.params.id + ' não encontrado!');
        } else {
            console.log('[ERROR]Erro ao recuperar usuário ' + request.params.id + ': ' + err);
            response.statusCode = 500;
            return response.send('Erro ao recuperar usuário ' + request.params.id + ': ' + err);
        }
    });
});

//Atualização de dados do usuário
app.put('/api/usuarios/:id', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]put em /api/usuarios. ID buscado: ' + request.params.id + '.');
    return usuarioModel.findById(request.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                usuario.nomeCompleto = request.body.nomeCompleto || usuario.nomeCompleto;
                usuario.email = request.body.email || usuario.email;
                usuario.senha = request.body.senha || usuario.senha;
                usuario.nascimento = request.body.nascimento || usuario.nascimento;
                usuario.genero = request.body.genero || usuario.genero;
                usuario.imagemPerfil = request.body.imagemPerfil || usuario.imagemPerfil;
                return usuario.save(function (err) {
                    if (!err) {
                        console.log('[INFO]Dados do usuário ' + request.params.id + ' foram atualizados.');
                        response.statusCode = 200;
                        return response.send(usuario);
                    } else {
                        switch (err.name) {
                            case 'ValidationError':
                                console.log('[WARN]Dados inconsistentes para atualização do usuário ' + request.params.id + ': ' + err);
                                response.statusCode = 400;
                                return response.send('Erro ao atualizar dados de usuário ' + request.params.id + ' devido a problemas de validação: ' + err);
                                break;
                            case 'MongoError':
                                switch (err.code) {
                                    case 11000:
                                        console.log('[WARN]Erro ao atualizar cadastro de usuário ' + request.params.id + ' devido a conflitos de dados: ' + err);
                                        response.statusCode = 409;
                                        return response.send('Erro ao atualizar cadastro de usuário ' + request.params.id + ' devido a conflitos de dados: ' + err);
                                        break;
                                    default:
                                        console.log('[ERROR]Erro ao atualizar cadastro do usuário ' + request.params.id + ': ' + err);
                                        response.statusCode = 500;
                                        return response.send('Erro ao atualizar cadastro do usuário ' + request.params.id + ': ' + err);
                                }
                                break;
                            default:
                                console.log('[ERROR]Erro ao atualizar cadastro de usuário: ' + err);
                                response.statusCode = 500;
                                return response.send('Erro ao atualizar cadastro do usuário ' + request.params.id + ': ' + err);
                        }
                    }
                });
            } else {
                console.log('[WARN]Atualização de cadastro falhou. Usuário com id ' + request.params.id + 'não foi encontrado.');
                response.statusCode = 404;
                return response.send('Usuário com id' + request.params.id + ' não foi encontrado: ' + err);
            }
        } else {
            console.log('[ERROR]Erro ao atualizar dados do usuário ' + request.params.id + ':' + err);
            response.statusCode = 500;
            return response.send('[ERROR]Erro ao atualizar cadastro do usuário ' + request.params.id + ': ' + err);
        }
    });
});

//Exclusão de cadastro de usuario
app.delete('/api/usuarios/:id', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]DELETE em /api/usuarios. ID buscado: ' + request.params.id + '.');
    usuarioModel.findById(request.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                return usuario.remove(function (err) {
                    if (!err) {
                        console.log('[INFO]Usuario ' + request.params.id + " foi removido da base de dados.");
                        response.statusCode = 204;
                        return response.send('');
                    } else {
                        console.log('[ERROR]Usuário ' + request.params.id + ' não pode ser excluído: ' + err);
                        response.statusCode = 500;
                        return response.send('Erro ao excluir usuário com id ' + request.params.id + '.');
                    }
                });
            }
            console.log('[ERROR]Usuário ' + request.params.id + ' não pode ser removido da base de dados. Motivo: Usuário não existe.');
            response.statusCode = 404;
            return response.send('Usuário com id ' + request.params.id + ' não encontrado.');
        } else {
            console.log('[ERROR]Erro ao deletar usuário ' + request.params.id + ': ' + err);
            response.statusCode = 500;
            return response.send('Erro ao excluir usuário com id ' + request.params.id + ': ' + err);
        }
    });
});


//--------------------------- LIVROS -----------------------------------

//Criação de novo livro
app.post('/api/livros', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[INFO]POST em /api/livros");
    var livro = new livroModel({
        titulo: request.body.titulo,
        genero: request.body.genero,
        enredo: request.body.enredo,
        personagens: request.body.personagens,
        ambientacao: request.body.ambientacao,
        proprietario: request.body.proprietario
    });
    livro.save(function (err) {
        if (err) {
            switch (err.name) {
                case 'ValidationError':
                    console.log('[WARN]Erro ao criar livro: ' + err);
                    response.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar livro: ' + err);
                    switch (err.code) {
                        case 11000:
                            response.statusCode = 409;
                            break;
                        default:
                            response.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar livro: ' + err);
                    response.statusCode = 500;
            }
            return response.send("Erro ao criar livro: " + err);
        }
        console.log('[INFO]Livro ' + livro.titulo + ' criado com sucesso.');
        response.statusCode = 201;
        return response.send(livro);
    });
});

//Recuperação de todos os livros da base
app.get('/api/livros', function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/livros.');
    return livroModel.find(function(err,livros){
        if (!err) {
            if (livros) {
                console.log('[INFO]Livros ' + request.params.id + ' recuperados com sucesso.');
                response.statusCode = 200;
                return response.send(livros);
            }
            console.log('[WARN]Livros não encontrados.');
            response.statusCode = 404;
            return response.send('Livros não encontrado!');
        } else {
            console.log('[ERROR]Erro ao recuperar livros: ' + err);
            response.statusCode = 500;
            return response.send('Erro ao recuperar livros : ' + err);
        }
    });
});

/*
 * Iniciando o server
 */
app.listen(8123, function () {
    console.log('[INFO]Server está ouvindo na porta 8123.');
});
