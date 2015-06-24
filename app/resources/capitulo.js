var mongoose = require('mongoose');
var Capitulo = mongoose.model('Capitulo');

exports.create = function (req, res) {

    Livro.findOne({proprietario: req.user._id, _id: req.params.idLivro}, function (err, livro) {

        if (err) {
            return res.send(err);
        }

        if (livro){

            var capitulo = new Capitulo();

            capitulo.titulo = req.body.titulo;
            capitulo.indice = req.body.indice;
            capitulo.texto = req.body.texto;
            capitulo.aprovado = req.body.aprovado;
            capitulo.autor = req.user._id;
            capitulo.livro = req.params.idLivro;

            capitulo.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Capítulo adicionado!', data: capitulo});
            });

        } else {

            res.json({
                "status": 401,
                "message": "Este livro não pertence ao usuário logado."
            });

        }

    });

};