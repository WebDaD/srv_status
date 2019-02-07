# srv-status

Simple Self-Containable Status-Messager. Creates a JSON-File and writes a Log

## Check

To Start a check use `node check.js config.json`

or build the binary and then use it: `./bin/check config.json` (or link it into your path)

You may create a cronjob to use this.

## Config

The Config is the biggest part of this project. See _config.sample.json_ for an example.

You have 2 global Attributes:

* statusFile: Here will the Status-File be written. Will try to create
* log: The Config for the Logging Plugin. See https://www.npmjs.com/package/lib-log

After that we have 'checkSuites', which is an Array of objects.

Each Object Contains:

* name: Name of the Suite
* checks: An Array of Checks

Each Check in the Array 'checks' is an object:

* name: Name of the Check
* type: The Type of the Check (see List of Check-Plugins)
* target: [Optional] A Target for the Check
* warning: [Optional] An Object with Warning Settings
* critical:  An Object with Critical Settings

Warning / Critical Settings Contain:

* value: The Value to trigger the status
* recommendations: Array of Strings to Help the Admin solve the problem
* actions: Array of Strings (linux commands) to automatically solve the problem

### List of Check-Plugins



## Server

To Start the Server use `node server.js /some/status.json 3000`

or build the binary and then send it to the background: `./bin/server /some/status.json 3000 & >/dev/null`  (or link it into your path)

## Action

To try to heal the services automagically use `node action.js /some/status.json`

or build the binary and then use it: `./bin/action /some/status.json`  (or link it into your path)

You may create a cronjob to use this.

## Test

There are 4 Levels of test, easiest done via npm-calls

* Just Tests: `npm run test`
* Tests with Coverage: `npm run test-coverage`
* Tests with Coverage and HTML-Output: `npm run test-graphics`
* Tests with Mutations: `npm run test-mutation`

## Build

To build the binaries use the nexe-CLI or simply `npm run build`

## TODO

* Add Section Check-Plugins
* Add Section Contribution
* Config: Add Recomodations for WARN, CRIT (just text > Do this, do that)
* Config: Add Actions (automatic resolves) for WARN CRIT (eg restart a process)
* Add port Test
* Add rabbitmq ALIVE Test
* Add rabbitmq messages check and Test api/exchanges/%2F/amq.topic (incoming, outgoing)

* Add Central Dashboard Service (collect info, display)
* Actions should be e.g. scripts for better solutions
* Have a script to deploy monitoring to a server (bins/actions/config)
* Config Website (create server monitoring configuration)
