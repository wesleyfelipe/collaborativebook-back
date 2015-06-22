var express = require('express');
var router = express.Router();

router.post('/colaborativebook/api/livros/:idLivro/capitulos', function (request, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("[INFO]POST em /api/livros/:idLivro/capitulos");
    var capitulo = new capituloModel({
        titulo: req.body.titulo,
        indice: req.body.indice,
        texto: req.body.texto,
        aprovado: req.body.aprovado,
        autor: req.body.autor,
        livro: req.params.idLivro
    });
    capitulo.save(function (err) {
        if (err) {
            switch (err.name) {
                case 'ValidationError':
                    console.log('[WARN]Erro ao criar capitulo: ' + err);
                    res.statusCode = 400;
                    break;
                case 'MongoError':
                    console.log('[WARN]Erro ao criar capitulo: ' + err);
                    switch (err.code) {
                        case 11000:
                            res.statusCode = 409;
                            break;
                        default:
                            res.statusCode = 500;
                    }
                    break;
                default:
                    console.log('[ERROR]Erro ao criar capitulo: ' + err);
                    res.statusCode = 500;
            }
            return res.send("Erro ao criar capitulo: " + err);
        }
        console.log('[INFO]Capitulo ' + capitulo.titulo + ' criado com sucesso.');
        res.statusCode = 201;
        return res.send(capitulo);
    });
});

module.exports = router;