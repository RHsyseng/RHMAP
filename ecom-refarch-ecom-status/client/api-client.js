// Script for automating the batch addition of checks

var request = require("request");
var async = require("async");
var _ = require("underscore")

var data = [
  {
    "name" : "Sample HTTP",
    "description" : "Sample HTTP endpoint check",
    "type" : "http",
    "config" : {
      "url" : "http://127.0.0.1:8001",
      "method" : "GET"
    }
  },
  {
    "name" : "Sample TCP",
    "description" : "Sample TCP check",
    "type" : "tcp",
    "config" : {
      "host" : "127.0.0.1",
      "port" : "8001"
    }
  }
];

var defaults = {
  "interval": "5",
  "timeout": "30",
};

var createParams = {
  "url" : "http://127.0.0.1:8001/checks",
  "method" : "POST",
}

var listParams = {
  "url" : "http://127.0.0.1:8001/checks",
  "method" : "GET",
  "json" : true
}

// First get a list of existing services
request(listParams, function(err, im, body) {
  if(err) console.error(err);

  var services = body;
  console.log('Existing services = ', services.length);

  async.each(data, function(item, cb) {

    var existing = false;
    _.each(services, function(service) {
      if(service.name == item.name && service.description === item.description) {
        existing = true;
      }
    });

    if( existing ) {
      console.log('Skipping existing service check - ', item.name);
      cb();
    } else {
      console.log('Creating new service check - ', item.name);
      item = _.extend(item, defaults);
      createParams.json = item;
      request(createParams, function(err, im, body) {
        if(err) console.log('Error creating service - ', item.name);

        console.log('Starting to run test on new check - ', item.name);
        // Kick of a test on the new check.
        var testParams = {
          "url" : "http://127.0.0.1:8001/checks/" + body._id + '/test',
          "method" : "GET"
        }
        request(testParams, function(err, im, body) {
          console.log('Finished running test on new check - ', item.name);
          cb();
        });
      });
    }
  },
  function(err) {
    console.log('Finished creating services');
  });

});
