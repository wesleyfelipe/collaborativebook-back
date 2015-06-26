// DEPENDECIAS

var livro = require('../app/resources/livro.js');
var capitulo = require('../app/resources/capitulo.js');
var usuario = require('../app/resources/usuario.js');
var auth = require('./auth.js');

// ROTAS

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.json({message: 'Welcome to colaborativebook API.'});
    });

    // LOGIN

    app.post('/login', auth.login);

    // USUARIO

    app.post('/signin', usuario.create);

    app.put('/api/update', usuario.update);
    app.get('/api/user', usuario.show);
    app.delete('/api/usuario/', usuario.delete);

    // LIVROS

    // Livros do usuario
    app.get('/api/livro', livro.index);

    // Livro especifico
    app.get('/api/livro/:id', livro.show);

    // Livros de outros usuarios (biblioteca)
    app.get('/api/biblioteca', livro.biblioteca);

    app.post('/api/livro', livro.create);

    app.delete('/api/livro/:id', livro.delete);

    // CAPITULOS

    app.get('/api/livro/:idLivro/capitulo', capitulo.index);
    app.post('/api/livro/:idLivro/capitulo', capitulo.create);
    app.post('/api/livro/:idLivro/capitulo/:idCapitulo', capitulo.aprova);
    app.put('/api/livro/:idLivro/capitulo/:idCapitulo', capitulo.update);
    app.delete('/api/livro/:idLivro/capitulo/:idCapitulo', capitulo.delete);


};
