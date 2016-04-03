// app.js

'use strict';

// require module dependencies
var express = require('express');
var compress = require('compression');
var session = require('express-session');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var dotenv = require('dotenv');
var path = require('path');
var flash = require('express-flash');

// load environment variables from .env file
dotenv.load();

// create Express server
var app = express();

// configure Express server
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(logger('dev'));
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

// setup error handlers
app.use(errorHandler());

// start Express server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;