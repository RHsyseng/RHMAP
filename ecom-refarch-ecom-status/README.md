# FeedHenry Health Monitor Service
[![Dependency Status](https://img.shields.io/david/feedhenry-templates/fh-health-monitor.svg?style=flat-square)](https://david-dm.org/feedhenry-templates/fh-health-monitor)

The FeedHenry Health Monitor service is intended for monitoring back end systems which are accessable to the FeedHenry cloud (via VPN or IP Punchthrough) but may not be exposed publicaly on the Internet.

The Health Monitor service allows you to define back end systems to monitor - via either basic socket connection or via HTTP. Once a back end system has been defined, you can choose how often to monitor it.

Since the monitoring service is running within the FeedHenry Cloud, it runs within and fully supports the full lifecycle management flow FeedHenry offers. This means that connectivity to backend systems in different lifecycle environments (e.g. dev, test, QA, Prod) can be defined within the corresponding environment which the health monitoring service is deployed to. This ensures that the appropriate monitoring checks exist only within the correct environment - ensuring that there is no cross environment calls or leakage of information.

The monitoring service exposes a number of endpoints (defined below) which allow the creation, management and monitoring of back end service checks to be automated and integrated into other tools. For example, the monitoring service exposes endpoints which return both the latest status of individual checks and an amalgamated view of all defined checks. If any of the checks are currently failing, the response from the endpoint will reflect this, allowing notification systems (such as pager duty) to automatically alert on call engineers.

## MongoDB setup

By default, when a new FeedHenry service is created, it is configured to use the $fh.db() API, which provides a light weight data storage solution. However, the health monitoring service requires access to a full MongoDB instance to operate. This means that we must first configure an instance of MongoDB for the service to use.

This is a simple process, which should only take a few moments to complete. However, until it is complete, the Health Monitoring service can not be used.

To enable full MongoDB access, the following steps are required:

 * Navigate to the Data Browser view in the App Studio (Available in the Left Side Nav from within the service).
 * Click the "Upgrade Database" button in the top right corner of the screen.
 * Read the details of the upgrade steps and once satisfied, click the "Upgrade now >>" button.
 * An upgrade progress screen will be displayed showing the current status of the upgrade process.
 * Once the upgrade is complete, you will be prompted to re-deploy you app. Click the "Deploy >>" button to navigate to the deploy screen.
 * Re-deploy the service code to complete the process.

This process must be completed for each environment that the service is to be deployed to.

Until such time as this is complete, the health monitoring service will only display the above instructions. Once complete the service can be used to monitor back end systems.

## To add remote-end-points

This feature is only available at `/admin`.

To create a new check the 'add new' will then be enabled. Click on 'Add new' and then enter the following data:

* Check Name: A name for your own reference
* Description: A description for your own reference
* Interval: How many minutes to wait between checks
* Timeout: How long to allow the service to respond, before considering it disconnected
* Record Rotation: How many days to store our logs of the responsiveness of the host
* Check Type: If the service is a website choose 'http(s)' otherwise choose 'TCP'

### TCP Options

* Host: The host to connect to.
* Port: The port to connect to.

### HTTP(s) Options

* Url: The URL of the website to connect to (e.g. http://feedhenry.com or https://feedhenry.com)
* Method: GET or POST, pick whichever your application is expecting, if you're unsure, use GET
* Send Body: This is not required, but in a POST request you can specify the POST data to send
* Response Regexp Check: This is not required, you can enter a regex in here to verify the response is as expected.

For more information about how to use this service go to Documentation page `/#documentation`. 

## Local Development
For local development, the default value for the MongoDB connection string is defined in the Gruntfile.js as `mongodb://127.0.0.1/FH_LOCAL`. This makes use of the standard MongoDB used by $fh.db(). It requires that MongoDB is installed locally and that the FH_LOCAL database is available.

### To Run

* $npm install -g grunt-cli
* $npm install
* $grunt serve
* Go to : `http://127.0.0.1:8001/`

## Test

### build 
```
npm install
```

### unit
As pre-requisites:
```
npm run serve
mongod
```
* run unit test:
``` 
npm test
```
### test coverage
As pre-requisites:
```
npm run serve
mongod
```
Run unit test:
``` 
npm run coverage
```

## Env vars 

* `FH_MONGODB_CONN_URL`: mongodb connection string. used by mongo db driver to connec to a valid mongodb instance 
* `HTTP(S)`
* `FH_PORT` or `VCAP_APP_PORT`: Options to override the default port (8001).

