/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true*/ /*global define */
"use strict";

var request = require('request');

var gatewayUrl = "http://gateway-service.ecom-services.svc.cluster.local:9091";

exports.list = function (callback) {

    request.get(
        gatewayUrl + '/products',
        function(error, response, body) {

            if (error) {
                return callback(error, null);

            } else if (response.statusCode !== 200) {
                return callback("ERROR: bad status code " + response.statusCode, null);

            } else {
                return callback(null, body);
            }
        }
    );
};

exports.featured = function (callback) {

    request.get(
        gatewayUrl + '/products/featured',
        function(error, response, body) {

            if (error) {
                return callback(error, null);

            } else if (response.statusCode !== 200) {
                return callback("ERROR: bad status code " + response.statusCode, null);

            } else {
                return callback(null, body);
            }
        }
    );
};

exports.get = function(sku, callback) {

    request.get(
        gatewayUrl + '/products/' + sku,
        function(error, response, body) {

            if (error) {
                return callback(error, null);

            } else if (response.statusCode !== 200) {
                return callback("ERROR: bad status code " + response.statusCode, null);

            } else {
                return callback(null, body);
            }
        }
    );
};