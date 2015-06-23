var mongoose = require('mongoose');
var Livro = mongoose.model('Livro');

exports.create = function (req, res) {

    var livro = new Livro();

    livro.titulo = req.body.titulo;
    livro.genero = req.body.genero;
    livro.enredo = req.body.enredo;
    livro.personagens = req.body.personagens;
    livro.ambientacao = req.body.ambientacao;
    livro.proprietario = req.body.proprietario;

    livro.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json({message: 'Livro adicionado!', data: livro});
    });

};

exports.index = function (req, res) {

    Livro.find(function (err, livros) {
        if (err) {
            return res.send(err);
        }
        res.send(livros);
    });

};

exports.delete = function (req, res) {

    Livro.findByIdAndRemove(req.params.id, function (err, livro) {
        if (err) {
            return res.send(err);
        }
        return res.json({message: 'Livro removido!', data: livro});
    });

};

exports.livrosUsuario = function (req, res) {

    Livro.find({proprietario: req.params.id}, function (err, livros) {
        if (err) {
            return res.send(err);
        }
        res.send(livros);
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