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
                    console.log('[WARN]Erro ao criar usuário: ' + err);
                    res.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar usuário: ' + err);
                    switch (err.code) {
                        case 11000:
                            res.statusCode = 409;
                            break;
                        default:
                            res.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar usuário: ' + err);
                    res.statusCode = 500;
            }
            return res.send("Erro ao criar usuário: " + err);
        }
        console.log('[INFO]Usuário ' + usuario.nomeUsuario + ' criado com sucesso.');
        res.statusCode = 201;
        return res.send(usuario);
    });
});

//Recuperação de um usuário
router.get('/colaborativebook/api/usuarios/:id', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log('[INFO]GET em /api/usuarios. ID buscado: ' + req.params.id + '.');
    return usuarioModel.findById(req.params.id, function (err, usuario) {
        if (!err) {
            if (usuario) {
                console.log('[INFO]Usuário ' + req.params.id + ' recuperado com sucesso.');
                res.statusCode = 200;
                return res.send(usuario);
            }
            console.log('[WARN]Usuário ' + req.params.id + ' não encontrado.');
            res.statusCode = 404;
            return res.send('Usuário ' + req.params.id + ' não encontrado!');
        } else {
            console.log('[ERROR]Erro ao recuperar usuário ' + req.params.id + ': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao recuperar usuário ' + req.params.id + ': ' + err);
        }
    });
});

//Atualização de dados do usuário
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
                        console.log('[INFO]Dados do usuário ' + req.params.id + ' foram atualizados.');
                        res.statusCode = 200;
                        return res.send(usuario);
                    } else {
                        switch (err.name) {
                            case 'ValidationError':
                                console.log('[WARN]Dados inconsistentes para atualização do usuário ' + req.params.id + ': ' + err);
                                res.statusCode = 400;
                                return res.send('Erro ao atualizar dados de usuário ' + req.params.id + ' devido a problemas de validação: ' + err);
                                break;
                            case 'MongoError':
                                switch (err.code) {
                                    case 11000:
                                        console.log('[WARN]Erro ao atualizar cadastro de usuário ' + req.params.id + ' devido a conflitos de dados: ' + err);
                                        res.statusCode = 409;
                                        return res.send('Erro ao atualizar cadastro de usuário ' + req.params.id + ' devido a conflitos de dados: ' + err);
                                        break;
                                    default:
                                        console.log('[ERROR]Erro ao atualizar cadastro do usuário ' + req.params.id + ': ' + err);
                                        res.statusCode = 500;
                                        return res.send('Erro ao atualizar cadastro do usuário ' + req.params.id + ': ' + err);
                                }
                                break;
                            default:
                                console.log('[ERROR]Erro ao atualizar cadastro de usuário: ' + err);
                                res.statusCode = 500;
                                return res.send('Erro ao atualizar cadastro do usuário ' + req.params.id + ': ' + err);
                        }
                    }
                });
            } else {
                console.log('[WARN]Atualização de cadastro falhou. Usuário com id ' + req.params.id + 'não foi encontrado.');
                res.statusCode = 404;
                return res.send('Usuário com id' + req.params.id + ' não foi encontrado: ' + err);
            }
        } else {
            console.log('[ERROR]Erro ao atualizar dados do usuário ' + req.params.id + ':' + err);
            res.statusCode = 500;
            return res.send('[ERROR]Erro ao atualizar cadastro do usuário ' + req.params.id + ': ' + err);
        }
    });
});

//Exclusão de cadastro de usuario
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
                        console.log('[ERROR]Usuário ' + req.params.id + ' não pode ser excluído: ' + err);
                        res.statusCode = 500;
                        return res.send('Erro ao excluir usuário com id ' + req.params.id + '.');
                    }
                });
            }
            console.log('[ERROR]Usuário ' + req.params.id + ' não pode ser removido da base de dados. Motivo: Usuário não existe.');
            res.statusCode = 404;
            return res.send('Usuário com id ' + req.params.id + ' não encontrado.');
        } else {
            console.log('[ERROR]Erro ao deletar usuário ' + req.params.id + ': ' + err);
            res.statusCode = 500;
            return res.send('Erro ao excluir usuário com id ' + req.params.id + ': ' + err);
        }
    });
});

module.exports = router;