#!/usr/bin/env node

/**
 * The Lila Of The Day API. This is the main script for the Lila Of The Day API server.
 * @namespace app
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the modules that will be used.
 * @var {object} express {@link https://github.com/expressjs/express Express}
 * @var {object} bodyParser {@link https://github.com/expressjs/body-parser Express body-parser}
 * @var {object} helmet {@link https://github.com/helmetjs Helmet}
 * @var {object} sslRedirect {@link https://github.com/nodenica/node-heroku-ssl-redirect sslRedirect}
 * @var {object} mongoose {@link https://github.com/Automattic/mongoose Mongoose}
 * @var {object} passport - {@link http://passportjs.org/ Passport}
 */
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var sslRedirect = require("heroku-ssl-redirect");
var mongoose = require("mongoose");
var passport = require("passport");

var routes = require("./routes/routes.js");

/**
 * Define the port for the app to listen on.
 * Use port 1138 if environmental variable PORT (process.env.PORT) is not defined.
 * @var {integer} port - Port for the app to use.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt MDN JavaScript parseInt}
 */
var port = parseInt(process.env.PORT, 10) || 1138;

/**
 * Connect to the MongoDB.
 */
var mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/";
mongoose.Promise = global.Promise; // https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(mongodb_uri);
mongoose.connection.on('connected', function () {
    console.log('MongoDB connected to: ' + mongodb_uri);
});
mongoose.connection.on('error', function (err) {
    console.log('MongoDB error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('MongoDB disconnected from: ' + mongodb_uri);
});



/**
 * Define all configurations here except routes (define routes last).
 * @var {object} app - The Express application instance.
 * @see {@link https://github.com/expressjs/express Express}
 * @see {@link https://expressjs.com/en/api.html#app.use Express API app.use}
 * @see {@link https://github.com/expressjs/body-parser Express body-parser}
 * @see {@link https://github.com/expressjs/body-parser#bodyparserjsonoptions Express body-parser json}
 * @see {@link https://github.com/expressjs/body-parser#bodyparserurlencodedoptions Express body-parser urlencoded}
 * @param {boolean} extended - When true uses {@link https://github.com/ljharb/qs qs querystring parsing}
 */
var app = express();
app.use(helmet());
app.use(sslRedirect());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());

app.set('json spaces', 2);

/**
 * Define routes last, after all other configurations.
 * @param {object} app - The Express application instance.
 */
routes(app);

/**
 * Listen for connections on the specified port.
 * @see {@link https://expressjs.com/en/api.html#app.listen Express API app.listen}
 * @param {integer} port - Port for the app to use.
 */
app.listen(port, function () {
    console.log(`Lila Of The Day API running on port: ${port}`);
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('MongoDB disconnected by the app');
        process.exit(0);
    });
});

module.exports = app; // for testing