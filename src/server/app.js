// app.js

'use strict';

// require module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var session = require('express-session');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var dotenv = require('dotenv');
var path = require('path');
var flash = require('express-flash');
var mailer = require('./mail/mailer');

// load environment variables from .env file
dotenv.load();

// create Express server
var app = express();

// configure Express server
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(flash());
app.use(express.static(path.join(__dirname, '../client'), {
    maxAge: 31557600000
}));

// setup primary app routes

// HOME -----------------------------------------------
app.get('/', function(req, res, next) {
    res.render('../client/index.html');
});

// MAIL -----------------------------------------------
app.post('/mail', function(req, res, next) {
    // create locals
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;

    // send mail
    mailer
        .sendMail(name, email, phone, message)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.send(err);
        });
});

// setup error handlers
app.use(errorHandler());

// start Express server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;