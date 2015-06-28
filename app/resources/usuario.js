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
        res.json({message: 'Usuário adicionado!', data: usuario});
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

        if (err) {
            return res.send(err);
        }

        if (usuario) {

            usuario.nomeCompleto = req.body.nomeCompleto || usuario.nomeCompleto;
            usuario.email = req.body.email || usuario.email;
            usuario.senha = req.body.senha || usuario.senha;
            usuario.nascimento = req.body.nascimento || usuario.nascimento;
            usuario.genero = req.body.genero || usuario.genero;
            usuario.imagemPerfil = req.body.imagemPerfil || usuario.imagemPerfil;

            usuario.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({message: 'Usuário atualizado!', data: usuario});
            });

        } else {
            res.statusCode = 404;
            res.json({message: 'Não encontrado'});
        }

    });
};
