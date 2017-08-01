/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true*/ /*global define */
"use strict";

var request = require('request');
require('request-debug')(request);

var fh = require('fh-mbaas-api');

// MBaaS Health Monitor URL reporting on Microservice availability
var healthUrl = process.env.MBAAS_HEALTH_URL || null;

exports.health = function (callback) {

    if (!healthUrl) {
        console.error("no health check endpoint defined for monitoring services");
        return callback(null, '{"result": "fail"}');
    }

    request.get(healthUrl,
        function(error, response, body) {

            if (error) {
                return callback(error, null);

            } else if (response.statusCode !== 200) {
                return callback("ERROR: bad status code " + response.statusCode, null);

            } else {
                var health = JSON.parse(body);

                if (health.result === 'ok') {
                    return callback(null, '{"result": "ok"}');

                } else {
                    console.error('health check detected a problem, status ' + health.result);
                    health.details.forEach(function(serviceEntry) {
                        console.error(serviceEntry.name + ' reported as ' + serviceEntry.result);
                    });
                    return callback(null, '{"result": "fail"}');
                }
            }
        }
    );
};