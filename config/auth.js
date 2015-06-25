var jwt = require('jwt-simple');

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var auth = {

    login: function (req, res) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        Usuario.findOne({email: username, senha: password}, function (err, user) {

            if (err) {
                console.log(err);
            }

            if (!user) { // If authentication fails, we send a 401 back

                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });

                return;

            }

            if (user) {
                // If authentication is success, we will generate a token
                // and dispatch it to the client

                res.json(genToken(user));

            }


        });

    }

};

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        login: user.email
    }, require('./secret')());
    return {
        token: token,
        expires: expires,
        user: user
    };
};

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
};

module.exports = auth;