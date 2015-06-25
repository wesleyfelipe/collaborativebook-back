'use strict';

var express = require('express');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3000;

// CONFIG MONGO

mongoose.connect('mongodb://localhost/colaborativebook');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '[ERROR] Erro de conexão (Mongo):'));

fs.readdirSync(__dirname + '/app/schemas').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/app/schemas/' + file);
});

// CONFIG EXPRESS

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES

app.all('/api/*', [require('./config/filter')]);

require('./config/routes')(app);

// SERVER

app.listen(port);
console.log('[INFO] Server on: ' + port);

module.exports = app;

