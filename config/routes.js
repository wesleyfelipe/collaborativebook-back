// DEPENDECIAS

var livro = require('../app/resources/livro.js');
var capitulo = require('../app/resources/capitulo.js');
var usuario = require('../app/resources/usuario.js');
var auth = require('./auth.js');

// ROTAS

module.exports = function (app) {

    // LOGIN

    app.post('/login', auth.login);

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

    app.post('/api/livro/:idLivro/capitulo', capitulo.create);

    // USUARIOS

    app.post('/api/usuario', usuario.create);
    app.get('/api/usuario/:id', usuario.show);
    app.delete('/api/usuario/:id', usuario.delete);

};
