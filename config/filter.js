var jwt = require('jwt-simple');

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

module.exports = function (req, res, next) {

    var token = req.headers['x-access-token'];

    if (token) {

        try {

            var decoded = jwt.decode(token, require('./secret.js')());

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            Usuario.findOne({email: decoded.login}, function (err, user) {

                if (err) {
                    console.log(err);
                }

                if (user) {
                    if ((req.url.indexOf('admin') >= 0 && user.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {

                        req.user = user;
                        next(); // To move to next middleware
                    } else {
                        res.status(403);
                        res.json({
                            "status": 403,
                            "message": "Not Authorized"
                        });
                        return;
                    }
                } else {
                    // No user with this name exists, respond back with a 401
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return;
                }
            });


        } catch (err) {

            res.status(401);
            res.json({
                "status": 401,
                "message": "Oops something went wrong",
                "error": err
            });

        }

    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }

};