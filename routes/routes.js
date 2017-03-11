#!/usr/bin/env node

"use strict";

/**
 * Define application end points (routes) for the Lila Of The Day API and how they respond to client requests.
 * @namespace routes
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * @public
 * @namespace router
 * @memberof routes
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
var router = function (app) {

    /**
     * GET request to the root route. Responds with status 200 and JSend-compliant response.
     * @public
     * @function
     * @memberof! routes.router
     * @example
     * var request = require("request");
     * request("http://api.lilaoftheday.com/",
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     */
    app
        .get("/", function (req, res) {
            res
                .status(200)
                .json({
                    "status": "success",
                    "data": {
                        "headers": req.headers
                    }
                });
        });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = router;