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
db.on('error', console.error.bind(console, 'Erro de conexão:'));


/*
 * Schemas
 */
var usuarioSchema = new mongoose.Schema({
    nomeCompleto: {type: String, required: true},
    nomeUsuario: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true, min: 8},
    nascimento: {type: Date, required: true},
    genero: {type: String, match: /^(m|f)$/, required: true}
});


/*
 * Models
 */
var usuarioModel = mongoose.model('Usuario', usuarioSchema);


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
    console.log("POST em /api/usuarios");
    var usuario = new usuarioModel({
        nomeCompleto: request.body.nomeCompleto,
        nomeUsuario: request.body.nomeUsuario,
        email: request.body.email,
        senha: request.body.senha,
        nascimento: request.body.nascimento,
        genero: request.body.genero
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
    console.log('GET em /api/usuarios. ID buscado: ' + request.params.id + '.');
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
    return usuarioModel.findById(request.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                usuario.nomeCompleto = request.body.nomeCompleto || usuario.nomeCompleto;
                usuario.email = request.body.email || usuario.email;
                usuario.senha = request.body.senha || usuario.senha;
                usuario.nascimento = request.body.nascimento || usuario.nascimento;
                usuario.genero = request.body.genero || usuario.genero;
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


/*
 * Iniciando o server
 */
app.listen(8123, function () {
    console.log('[INFO]Server está ouvindo na porta 8123.');
});





//
//
///*
// * Express Dependencies
// */
//var express = require('express');
//var app = express();
//var port = 3000;
//
///*
// * Use Handlebars for templating
// */
//var exphbs = require('express3-handlebars');
//var hbs;
//
//// For gzip compression
//app.use(express.compress());
//
///*
// * Config for Production and Development
// */
//if (process.env.NODE_ENV === 'production') {
//	// Set the default layout and locate layouts and partials
//	app.engine('handlebars', exphbs({
//		defaultLayout : 'main',
//		layoutsDir : 'dist/views/layouts/',
//		partialsDir : 'dist/views/partials/'
//	}));
//
//	// Locate the views
//	app.set('views', __dirname + '/dist/views');
//
//	// Locate the assets
//	app.use(express.static(__dirname + '/dist/assets'));
//
//} else {
//	app.engine('handlebars', exphbs({
//		// Default Layout and locate layouts and partials
//		defaultLayout : 'main',
//		layoutsDir : 'views/layouts/',
//		partialsDir : 'views/partials/'
//	}));
//
//	// Locate the views
//	app.set('views', __dirname + '/views');
//
//	// Locate the assets
//	app.use(express.static(__dirname + '/assets'));
//}
//
//// Set Handlebars
//app.set('view engine', 'handlebars');
//
///*
// * Routes
// */
//// Index Page
//app.get('/', function(request, response, next) {
//	response.render('index');
//});
//
///*
// * Start it up
// */
//app.listen(process.env.PORT || port);
//console.log('Express started on port ' + port);