# SRV-Status

Simple Self-Containable Status-Messager. Creates a JSON-File and writes a Log

## Check

## Server

To Start the Server use `node server.js /some/status.json 3000`

or build the binary and then send it to the background: `./server /some/status.json 3000 & >/dev/null`

## Action

## Test

## Build

## TODO

* Fill this readme ;-)
* Config: Add Recomodations for WARN, CRIT (just text > Do this, do that)
* Config: Add Actions (automatic resolves) for WARN CRIT (eg restart a process)
* have actions.js (scan status.json, do actions on WARN, CRIT)
* Add port check
* Add rabbitmq check