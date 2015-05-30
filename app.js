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

//Inserção de novo usuário
app.post( '/api/usuarios', function( request, response ) {
    console.log("Recebido POST em /api/usuarios");
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
            return response.send( usuario );
        } else {
            console.log( err );
            return response.send('Erro ao gravar novo usuário: ' + err);
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