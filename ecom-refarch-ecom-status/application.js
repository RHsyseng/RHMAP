var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

// handle race condition with OCP 3.X; call for connectionString
// and set to enviro var prior to init of monitor
mbaasApi.db({
    "act": "connectionString"

}, function (err, connectionString) {

    if (err) throw err;

    console.log("connectionString fetched: " + connectionString);

    // list the endpoints which you want to make securable here
    var securableEndpoints;
    // fhlint-begin: securable-endpoints
    securableEndpoints = [''];
    // fhlint-end

    var app = express();

    // Enable CORS for all requests
    app.use(cors());

    // Note: the order which we add middleware to Express here is important!
    app.use('/sys', mbaasExpress.sys(securableEndpoints));
    app.use('/mbaas', mbaasExpress.mbaas);

    // allow serving of static files from the public directory
    //app.use(express.static(__dirname + '/public'));

    // Note: important that this is added just before your own Routes
    app.use(mbaasExpress.fhmiddleware());

    // fhlint-begin: custom-routes
    app.set('views', __dirname + '/views');
    app.engine('ejs', require('ejs').__express);
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.use('/', require('./libs/monitor'));
    // fhlint-end

    // Important that this is last!
    app.use(mbaasExpress.errorHandler());

    var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
    var server = app.listen(port, function () {
        console.log("App started at: " + new Date() + " on port: " + port);
    });
});
