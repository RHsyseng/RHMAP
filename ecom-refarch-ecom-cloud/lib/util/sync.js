/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true*/ /*global define */
"use strict";

var fh = require('fh-mbaas-api');

var globalRequestInterceptor = function(dataset_id, params, cb) {

    console.log('sync intercept for dataset ' + dataset_id + ' with params ' + params);
    return cb(null);
};

fh.sync.globalInterceptRequest(globalRequestInterceptor);