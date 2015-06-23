var mongoose = require('mongoose');
var Capitulo = mongoose.model('Capitulo');

exports.create = function (req, res) {

    var capitulo = new Capitulo();

    capitulo.titulo = req.body.titulo;
    capitulo.indice = req.body.indice;
    capitulo.texto = req.body.texto;
    capitulo.aprovado = req.body.aprovado;
    capitulo.autor = req.body.autor;
    capitulo.livro = req.params.idLivro;

    capitulo.save(function (err) {
        if (err) {
            return res.send(err);
        }
       res.json({message: 'Capítulo adicionado!', data: capitulo});
    });

};