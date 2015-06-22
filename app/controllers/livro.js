var mongoose = require('mongoose')
var Livro = mongoose.model('Livro')
var utils = require('../../lib/utils')
var extend = require('util')._extend

exports.create = function (req, res) {

    //router.post('/colaborativebook/api/livros', function (request, response) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[INFO]POST em /api/livros");

    var livro = new Livro({
        titulo: req.body.titulo,
        genero: req.body.genero,
        enredo: req.body.enredo,
        personagens: req.body.personagens,
        ambientacao: req.body.ambientacao,
        proprietario: req.body.proprietario
    });

    livro.save(function (err) {
        if (err) {
            switch (err.name) {
                case 'ValidationError':
                    console.log('[WARN]Erro ao criar livro: ' + err);
                    res.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar livro: ' + err);
                    switch (err.code) {
                        case 11000:
                            res.statusCode = 409;
                            break;
                        default:
                            res.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar livro: ' + err);
                    res.statusCode = 500;
            }
            return res.send("Erro ao criar livro: " + err);
        }
        console.log('[INFO]Livro ' + livro.titulo + ' criado com sucesso.');
        res.statusCode = 201;
        return res.send(livro);
    });


};

//
////Recupera��o de todos os livros da base

exports.index = function (req, res) {
//router.get('/colaborativebook/api/livros', function (request, response) {

    console.log('[INFO]GET em /api/livros.');

    return Livro.find(function (err, livros) {
        if (!err) {
            return res.send(livros);
        } else {
            return console.log(err);
        }
    });

    //req.setHeader("Access-Control-Allow-Origin", "*");
    //console.log('[INFO]GET em /api/livros.');

    //return Livro.find().lean().exec(function (err, livros) {
    //    return res.end(JSON.stringify(livros));
    //});


    //return Livro.find(function (err, livros) {
    //    if (!err) {
    //        if (livros) {
    //            console.log('[INFO]Livros recuperados com sucesso.');
    //            res.statusCode = 200;
    //            return res.send(livros);
    //        }
    //        console.log('[WARN]Livros n�o encontrados.');
    //        res.statusCode = 404;
    //        return res.send('Livros n�o encontrado!');
    //    } else {
    //        console.log('[ERROR]Erro ao recuperar livros: ' + err);
    //        res.statusCode = 500;
    //        return res.send('Erro ao recuperar livros : ' + err);
    //    }
    //});

//});

};

//
////Exclus�o de livro
exports.delete = function (req, res) {
    //router.delete('/colaborativebook/api/livros/:id', function (request, response) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]DELETE em /api/livros. ID buscado: ' + req.params.id + '.');

    Livro.findById(req.params.id, function (err, livro) {
        if (!err) {
            if (livro) {
                return livro.remove(function (err) {
                    if (!err) {
                        console.log('[INFO]Livro ' + req.params.id + " foi removido da base de dados.");
                        res.statusCode = 204;
                        return res.send('');
                    } else {
                        console.log('[ERROR]Livro ' + req.params.id + ' n�o pode ser exclu�do: ' + err);
                        res.statusCode = 500;
                        return res.send('Erro ao excluir livro com id ' + req.params.id + '.');
                    }
                });
            }
            console.log('[ERROR]Livro ' + req.params.id + ' n�o pode ser removido da base de dados. Motivo: Livro n�o existe.');
            res.statusCode = 404;
            return res.send('Livro com id ' + req.params.id + ' n�o encontrado.');
        } else {
            console.log('[ERROR]Erro ao deletar livro ' + req.params.id + ': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao excluir livro com id ' + req.params.id + ': ' + err);
        }
    });
    //});
};
//
////Recuperar livros de um usu�rio

exports.livrosUsuario = function (req, res) {
//router.get('/colaborativebook/api/usuarios/:idUsuario/livros', function (request, response) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/usuarios/:idUsuario/livros.');

    return Livro.find({ proprietario : req.params.idUsuario },function(err,livros){
        if (!err) {
            if (livros) {
                console.log('[INFO]Livros do usuario '+ req.params.idUsuario +' recuperados com sucesso.');
                res.statusCode = 200;
                return res.send(livros);
            }
            console.log('[WARN]Livros n�o encontrados.');
            res.statusCode = 404;
            return res.send('Livros n�o encontrado!');
        } else {
            console.log('[ERROR]Erro ao recuperar livros o usuario '+req.params.idUsuario+': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao recuperar livros '+req.params.idUsuario+': ' + err);
        }
    });
//});

};

exports.show = function (req, res) {
////Recuperar um livro
//router.get('/colaborativebook/api/livros/:id', function (request, response) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/livros/:id.');

    return Livro.findById(req.params.id, function (err, livro) {
        if (!err) {
            if (livro) {
                console.log('[INFO]Livro com id '+ req.params.id +' recuperado com sucesso.');
                res.statusCode = 200;
                return res.send(livro);
            }
            console.log('[WARN]Livro n�o encontrados com id '+req.params.id+'.');
            res.statusCode = 404;
            return res.send('Livro n�o encontrados com id '+req.params.id+'!');
        } else {
            console.log('[ERROR]Erro ao recuperar livro com id '+req.params.id+': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao recuperar livro com id '+req.params.id+': ' + err);
        }
    });
//});

};