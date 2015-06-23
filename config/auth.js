var jwt = require('jwt-simple');

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var auth = {

    login: function (req, res) {

        console.log(req.body.username);
        console.log(req.body.password);

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

        // Fire a query to your DB and check if the credentials are valid
        var dbUserObj = auth.validate(username, password);

        console.log(dbUserObj);

        if (!dbUserObj) { // If authentication fails, we send a 401 back
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        if (dbUserObj) {
            // If authentication is success, we will generate a token
            // and dispatch it to the client
            res.json(genToken(dbUserObj));
        }

    },

    validate: function (username, password) {

        Usuario.findOne({email: username, senha: password}, function (err, user) {
            if (err) {
                console.log(err);
            }
            //return user.toObject();
        });

        // spoofing the DB response for simplicity
        //var dbUserObj = { // spoofing a userobject from the DB.
        //    name: 'arvind',
        //    role: 'user',
        //    username: 'arvind@myapp.com'
        //};
        //return dbUserObj;

    },

    validateUser: function (username) {

        Usuario.findOne({email: username}, function (err, user) {
            if (err) {
                console.log(err);
            }
            return user;
        });

        // spoofing the DB response for simplicity
        //var dbUserObj = { // spoofing a userobject from the DB.
        //    name: 'arvind',
        //    role: 'user',
        //    username: 'arvind@myapp.com'
        //};

        //return dbUserObj;

    },

};

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
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