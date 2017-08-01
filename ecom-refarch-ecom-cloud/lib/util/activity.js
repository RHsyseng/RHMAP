/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true*/ /*global define */
"use strict";

var fh = require('fh-mbaas-api');

//record app activities in the cache
var key = 'user_activity';

exports.setCacheKey = function(cacheKey){
    key = cacheKey;
};

exports.record = function(params, callback) {
    var activity = {
        created: new Date().getTime(),
        action: params.action
    };

    fh.cache({
        act: "load",
        key: key
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }

        var activityList = JSON.parse(res);
        if (activityList) {
            activityList.push(activity);
        } else {
            activityList = [activity];
        }

        fh.cache({
            act: "save",
            key: key,
            value: JSON.stringify(activityList)
        }, function(err, res) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, {
                'status': 'ok'
            });
        });
    });
};

exports.list = function(params, callback) {
    fh.cache({
        act: "load",
        key: key
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, res);
    });
};

exports.reset = function(callback) {

    fh.cache({
        act: "save",
        key: key,
        value: JSON.stringify([])
    }, function(err, res) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, {
            'status': 'ok'
        });
    });
};