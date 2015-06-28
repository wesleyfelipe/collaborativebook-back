var mongoose = require('mongoose');
var Capitulo = mongoose.model('Capitulo');
var Livro = mongoose.model('Livro');


exports.show = function (req, res) {

    Capitulo.findById(req.params.idCapitulo).populate('livro').populate('autor', 'nomeCompleto').exec(function (err, capitulo) {
        if (err) {
            return res.send(err);
        }
        res.send(capitulo);
    });

};

exports.index = function (req, res) {

    Capitulo.find({livro: req.params.idLivro}, function (err, capitulos) {
        if (err) {
            return res.send(err);
        }
        res.send(capitulos);
    });

};

exports.create = function (req, res) {

    Livro.findOne({_id: req.params.idLivro}, function (err, livro) {

        if (err) {
            return res.send(err);
        }

        if (livro){

            var capitulo = new Capitulo();

            capitulo.titulo = req.body.titulo;
            capitulo.indice = req.body.indice;
            capitulo.texto = req.body.texto;
            capitulo.autor = req.user._id;
            capitulo.livro = req.params.idLivro;

            capitulo.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Cap�tulo adicionado!', data: capitulo});
            });

        } else {

            res.json({
                "status": 404,
                "message": "N�o encontrado."
            });

        }

    });

};

exports.aprova = function (req, res) {

    Capitulo.findOne({_id: req.params.idCapitulo, autor: req.user._id}, function (err, capitulo) {

        if (err) {
            return res.send(err);
        }

        if (capitulo){

            if (capitulo.aprovado) {

                return res.json({
                    "status": 401,
                    "message": "Este cap�tulo j� foi aprovado."
                });

            }

            capitulo.aprovado = true;

            capitulo.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Cap�tulo aprovado!', data: capitulo});
            });

        } else {

            res.json({
                "status": 404,
                "message": "N�o encontrado."
            });

        }

    });

};

exports.update = function (req, res) {

    Capitulo.findOne({_id: req.params.idCapitulo}, function (err, capitulo) {

        if (err) {
            return res.send(err);
        }

        if (capitulo){

            if (capitulo.aprovado) {

                return res.json({
                    "status": 401,
                    "message": "Este cap�tulo j� foi aprovado."
                });

            }

            capitulo.titulo = req.body.titulo || capitulo.titulo;
            capitulo.texto = req.body.texto || capitulo.texto;

            capitulo.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Cap�tulo atualizado!', data: capitulo});
            });

        } else {

            res.json({
                "status": 404,
                "message": "N�o encontrado."
            });

        }

    });

};

exports.delete = function (req, res) {

    Capitulo.findOneAndRemove({_id: req.params.idCapitulo, autor: req.user._id}, function (err, capitulo) {
        if (err) {
            return res.send(err);
        }
        return res.json({message: 'Cap�tulo removido!', data: capitulo});
    });

};