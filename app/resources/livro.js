var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var Livro = mongoose.model('Livro');

exports.create = function (req, res) {

    var livro = new Livro();

    livro.titulo = req.body.titulo;
    livro.genero = req.body.genero;
    livro.enredo = req.body.enredo;
    livro.personagens = req.body.personagens;
    livro.ambientacao = req.body.ambientacao;
    livro.proprietario = req.user._id;

    livro.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json({message: 'Livro adicionado!', data: livro});
    });

};

exports.index = function (req, res) {

    Livro.find({proprietario: req.user._id}, function (err, livros) {
        if (err) {
            return res.send(err);
        }
        res.send(livros);
    });

};

exports.biblioteca = function (req, res) {

    Livro.where('proprietario').ne(req.user._id).lean().exec(function (err, livros) {

        if (err) {
            return res.send(err);
        }

        var id_proprietarios = livros.map(function(livro) { return livro.proprietario; });

        Usuario.find({_id: {$in: id_proprietarios}}).lean().exec(function (err, usuarios) {
            if (err) {
                return res.send(err);
            }

            // Que Deus esteja conosco ...

            for(var l in livros) {
                for(var u in usuarios) {

                    if (livros[l].proprietario.toString() == usuarios[u]._id.toString()){
                        livros[l].nomeProprietario = usuarios[u].nomeCompleto;
                        break;
                    }
                }
            }

            res.send(livros);

        });

    });

};

exports.delete = function (req, res) {

    Livro.findOneAndRemove({_id: req.params.id, proprietario: req.user._id}, function (err, livro) {
        if (err) {
            return res.send(err);
        }
        return res.json({message: 'Livro removido!', data: livro});
    });

};

exports.show = function (req, res) {

    Livro.findById(req.params.id, function (err, livro) {
        if (err) {
            return res.send(err);
        }
        res.send(livro);
    });

};