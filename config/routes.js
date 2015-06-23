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

    app.get('/api/livro/:id', livro.show);
    app.get('/api/livro', livro.index);
    app.post('/api/livro', livro.create);
    app.delete('/api/livro/:id', livro.delete);
    app.get('/api/usuarios/:idUsuario/livros', livro.livrosUsuario);

    // CAPITULOS

    app.post('/api/livro/:idLivro/capitulo', capitulo.create);

    // USUARIOS

    app.post('/api/usuario', usuario.create);
    app.get('/api/usuario/:id', usuario.show);
    app.delete('/api/usuario/:id', usuario.delete);

};
