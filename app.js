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
mongoose.connect( 'mongodb://localhost/colaborativebook' );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'));


/*
 * Schemas
 */
var usuarioSchema = new mongoose.Schema({
    nomeCompleto: { type : String, required : true },
    nomeUsuario: { type : String, required : true, unique : true },
    email: { type : String, required : true, unique : true },
    senha: { type : String, required : true, min : 8 },
    nascimento: { type : Date, required : true },
    genero : { type : String, match: /^(m|f)$/}
});


/*
 * Models
 */
var usuarioModel = mongoose.model( 'Usuario', usuarioSchema );


/*
 * Criação e configuração do servidor
 */
var app = express();
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );
    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );
    //perform route lookup based on url and HTTP method
    app.use( app.router );
    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});


/*
 * Rotas
 */

//------------------- USUÁRIOS -----------------------------

//Inserção de novo usuário
app.post( '/api/usuarios', function( request, response ) {
    console.log("POST em /api/usuarios");
    var usuario = new usuarioModel({
        nomeCompleto: request.body.nomeCompleto,
        nomeUsuario: request.body.nomeUsuario,
        email: request.body.email,
        senha: request.body.senha,
        nascimento: request.body.nascimento,
        genero: request.body.genero
    });
    console.log(request.body.title);
    usuario.save( function( err ) {
        if( !err ) {
            console.log( 'Usuário criado!' );
            response.statusCode = 200;
            return response.send( usuario );
        } else {
            console.log( err );
            return response.send('Erro ao gravar novo usuário: ' + err);
        }
    });
});

//Recuperação de um usuário
app.get( '/api/usuarios/:id', function( request, response ) {
    console.log("GET em /api/usuarios. ID buscado: " + request.params.id)
    return usuarioModel.findById( request.params.id, function( err, usuario ) {
        if( !err ) {
            return response.send( usuario );
        } else {
            console.log( err );
            return response.send('Erro ao recuperar dados de usuário: ' + err);
        }
    });
});

//Atualização de dados do usuário
app.put( '/api/usuarios/:id', function( request, response ) {
    return usuarioModel.findById( request.params.id, function( err, usuario ) {
        usuario.nomeCompleto = request.body.nomeCompleto || usuario.nomeCompleto;
        usuario.email = request.body.email || usuario.email;
        usuario.senha = request.body.senha || usuario.senha;
        usuario.nascimento = request.body.nascimento || usuario.nascimento;
        usuario.genero = request.body.genero || usuario.genero;

        return usuario.save( function( err ) {
            if( !err ) {
                console.log( 'Usuário ' + request.params.id + ' atualizado!' );
                return response.send( usuario );
            } else {
                console.log( err );
                return response.send('Erro ao atualizar o usuario ' + request.params.id + ': ' + err);
            }
        });
    });
});

//Exclusão de cadastro de usuario
app.delete( '/api/usuarios/:id', function( request, response ) {
    usuarioModel.findById( request.params.id, function( err, usuario ) {
        if( !err ) {
            if( usuario === null){
                console.log('DELETE falhou para usuário ' + request.params.id + '. Motivo: Usuário não existe.');
                response.statusCode = 404;
                return response.send('Usuário com id ' + request.params.id + ' não encontrado.');
            }
            return usuario.remove( function( err ) {
                if( !err ) {
                    console.log( 'Usuario '+ request.params.id +" foi removido!" );
                    response.statusCode = 204;
                    return response.send( '' );
                } else {
                    console.log('DELETE falhou para usuário ' + request.params.id + ': ' + err);
                    response.statusCode = 500;
                    return response.send('Erro ao excluir usuário com id ' + request.params.id + '.');
                }
            });
        }else{
            console.log('DELETE falhou para usuário ' + request.params.id + ': ' + err);
            response.statusCode = 500;
            return response.send('Erro ao excluir usuário com id ' + request.params.id + '.');
        }
    });
});


/*
 * Iniciando o server
 */
app.listen( 8123, function() {
    console.log( 'Express server está ouvindo na porta 8123!' );
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