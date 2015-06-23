// DEPENDECIAS

var livro = require('../app/resources/livro.js');
var capitulo = require('../app/resources/capitulo.js');
var usuario = require('../app/resources/usuario.js');

// ROTAS

module.exports = function (app) {

    // LIVROS

    app.get('/livro/:id', livro.show);
    app.get('/livro', livro.index);
    app.post('/livro', livro.create);
    app.delete('/livro/:id', livro.delete);
    app.get('/usuarios/:idUsuario/livros', livro.livrosUsuario);

    // CAPITULOS

    app.post('/livro/:idLivro/capitulos', capitulo.create);


    // USUARIOS

    app.post('/usuario', usuario.create);
    app.get('/usuario/:id', usuario.show);
    app.delete('/usuario/:id', usuario.delete);

}
