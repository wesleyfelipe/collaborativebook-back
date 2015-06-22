var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');


var express = require('express');
var router = express.Router();

router.post('/colaborativebook/api/usuarios', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[INFO]POST em /api/usuarios");
    var usuario = new usuarioModel({
        nomeCompleto: req.body.nomeCompleto,
        nomeUsuario: req.body.nomeUsuario,
        email: req.body.email,
        senha: req.body.senha,
        nascimento: req.body.nascimento,
        genero: req.body.genero,
        imagemPerfil: 'assets/img/default_avatar.png'
    });
    usuario.save(function (err) {
        if (err) {
            switch (err.name) {
                case 'ValidationError':
                    console.log('[WARN]Erro ao criar usu�rio: ' + err);
                    res.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar usu�rio: ' + err);
                    switch (err.code) {
                        case 11000:
                            res.statusCode = 409;
                            break;
                        default:
                            res.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar usu�rio: ' + err);
                    res.statusCode = 500;
            }
            return res.send("Erro ao criar usu�rio: " + err);
        }
        console.log('[INFO]Usu�rio ' + usuario.nomeUsuario + ' criado com sucesso.');
        res.statusCode = 201;
        return res.send(usuario);
    });
});

//Recupera��o de um usu�rio
router.get('/colaborativebook/api/usuarios/:id', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/usuarios. ID buscado: ' + req.params.id + '.');
    return usuarioModel.findById(req.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                console.log('[INFO]Usu�rio ' + req.params.id + ' recuperado com sucesso.');
                res.statusCode = 200;
                return res.send(usuario);
            }
            console.log('[WARN]Usu�rio ' + req.params.id + ' n�o encontrado.');
            res.statusCode = 404;
            return res.send('Usu�rio ' + req.params.id + ' n�o encontrado!');
        } else {
            console.log('[ERROR]Erro ao recuperar usu�rio ' + req.params.id + ': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao recuperar usu�rio ' + req.params.id + ': ' + err);
        }
    });
});

//Atualiza��o de dados do usu�rio
router.put('/colaborativebook/api/usuarios/:id', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]put em /api/usuarios. ID buscado: ' + req.params.id + '.');
    return usuarioModel.findById(req.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                usuario.nomeCompleto = req.body.nomeCompleto || usuario.nomeCompleto;
                usuario.email = req.body.email || usuario.email;
                usuario.senha = req.body.senha || usuario.senha;
                usuario.nascimento = req.body.nascimento || usuario.nascimento;
                usuario.genero = req.body.genero || usuario.genero;
                usuario.imagemPerfil = req.body.imagemPerfil || usuario.imagemPerfil;
                return usuario.save(function (err) {
                    if (!err) {
                        console.log('[INFO]Dados do usu�rio ' + req.params.id + ' foram atualizados.');
                        res.statusCode = 200;
                        return res.send(usuario);
                    } else {
                        switch (err.name) {
                            case 'ValidationError':
                                console.log('[WARN]Dados inconsistentes para atualiza��o do usu�rio ' + req.params.id + ': ' + err);
                                res.statusCode = 400;
                                return res.send('Erro ao atualizar dados de usu�rio ' + req.params.id + ' devido a problemas de valida��o: ' + err);
                                break;
                            case 'MongoError':
                                switch (err.code) {
                                    case 11000:
                                        console.log('[WARN]Erro ao atualizar cadastro de usu�rio ' + req.params.id + ' devido a conflitos de dados: ' + err);
                                        res.statusCode = 409;
                                        return res.send('Erro ao atualizar cadastro de usu�rio ' + req.params.id + ' devido a conflitos de dados: ' + err);
                                        break;
                                    default:
                                        console.log('[ERROR]Erro ao atualizar cadastro do usu�rio ' + req.params.id + ': ' + err);
                                        res.statusCode = 500;
                                        return res.send('Erro ao atualizar cadastro do usu�rio ' + req.params.id + ': ' + err);
                                }
                                break;
                            default:
                                console.log('[ERROR]Erro ao atualizar cadastro de usu�rio: ' + err);
                                res.statusCode = 500;
                                return res.send('Erro ao atualizar cadastro do usu�rio ' + req.params.id + ': ' + err);
                        }
                    }
                });
            } else {
                console.log('[WARN]Atualiza��o de cadastro falhou. Usu�rio com id ' + req.params.id + 'n�o foi encontrado.');
                res.statusCode = 404;
                return res.send('Usu�rio com id' + req.params.id + ' n�o foi encontrado: ' + err);
            }
        } else {
            console.log('[ERROR]Erro ao atualizar dados do usu�rio ' + req.params.id + ':' + err);
            res.statusCode = 500;
            return res.send('[ERROR]Erro ao atualizar cadastro do usu�rio ' + req.params.id + ': ' + err);
        }
    });
});

//Exclus�o de cadastro de usuario
router.delete('/colaborativebook/api/usuarios/:id', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]DELETE em /api/usuarios. ID buscado: ' + req.params.id + '.');
    usuarioModel.findById(req.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                return usuario.remove(function (err) {
                    if (!err) {
                        console.log('[INFO]Usuario ' + req.params.id + " foi removido da base de dados.");
                        res.statusCode = 204;
                        return res.send('');
                    } else {
                        console.log('[ERROR]Usu�rio ' + req.params.id + ' n�o pode ser exclu�do: ' + err);
                        res.statusCode = 500;
                        return res.send('Erro ao excluir usu�rio com id ' + req.params.id + '.');
                    }
                });
            }
            console.log('[ERROR]Usu�rio ' + req.params.id + ' n�o pode ser removido da base de dados. Motivo: Usu�rio n�o existe.');
            res.statusCode = 404;
            return res.send('Usu�rio com id ' + req.params.id + ' n�o encontrado.');
        } else {
            console.log('[ERROR]Erro ao deletar usu�rio ' + req.params.id + ': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao excluir usu�rio com id ' + req.params.id + ': ' + err);
        }
    });
});

module.exports = router;