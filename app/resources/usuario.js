var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

exports.create = function (req, res) {

    var usuario = new Usuario();

    usuario.nomeCompleto = req.body.nomeCompleto;
    usuario.nomeUsuario = req.body.nomeUsuario;
    usuario.email = req.body.email;
    usuario.senha = req.body.senha;
    usuario.nascimento = req.body.nascimento;
    usuario.genero = req.body.genero;
    usuario.role = "admin";
    usuario.imagemPerfil = 'assets/img/default_avatar.png';

    usuario.save(function (err) {
        if (err) {
            return res.send(err);
        }
        res.json({message: 'Usu�rio adicionado!', data: usuario});
    });

};

exports.show = function (req, res) {

    Usuario.findById(req.user._id, function (err, usuario) {
        if (err) {
            return res.send(err);
        }
        res.send(usuario);
    });

};

exports.delete = function (req, res) {

    Usuario.findByIdAndRemove(req.user._id, function (err, usuario) {
        if (err) {
            return res.send(err);
        }
        return res.json({message: 'Usuario removido!', data: usuario});
    });

};

exports.update = function (req, res) {

    Usuario.findById(req.user._id, function (err, usuario) {
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
};
