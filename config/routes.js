// DEPENDECIAS

var livro = require('../app/controllers/livro.js');

// ROTAS

module.exports = function (app) {

    // LIVROS

    app.get('/livro/:id', livro.show);
    app.get('/livro', livro.index);
    app.post('/livro', livro.create);
    app.delete('/livro/:id', livro.delete);
    app.get('/usuarios/:idUsuario/livros', livro.livrosUsuario);


}
