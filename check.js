let config = require(process.argv[2])
// TODO: die if no config

const Log = require('log') // TODO: fix (npm)
const l = new Log(config.log)

const os = require('os')
const fs = require('fs')

// TODO: require for every check the needed lib from lib/
const checkLoad = require('./lib/load.js') // TODO: test

let status = JSON.parse(JSON.stringify(config))
delete status.statusFile
delete status.log
status.status = 'OK'
l.info('Starting Check')
for (let index = 0; index < config.checkSuites.length; index++) {
  const suite = config.checkSuites[index]
  status.checkSuites[index].status = 'OK'
  for (let subindex = 0; subindex < suite.checks.length; subindex++) {
    const check = suite.checks[subindex]
    let result = {}
    switch (check.type) {
      case 'load': result = checkLoad(check, os); break
      // TODO: all checks
      default: continue
    }
    status.checkSuites[index].checks[subindex].status = result.status
    status.checkSuites[index].checks[subindex].result = result.value
    if (result.status === 'CRIT') {
      status.checkSuites[index].status = 'CRIT'
      status.status = 'CRIT'
      l.error('CHECK "' + check.name + '" of Suite "' + suite.name + '" is CRITICAL: ' + result.value)
    } else if (result.status === 'WARN') {
      if (status.checkSuites[index].status !== 'OK' && status.checkSuites[index].status !== 'CRIT') {
        status.checkSuites[index].status = 'WARN'
      }
      if (status.status !== 'OK' && status.status !== 'CRIT') {
        status.status = 'WARN'
      }
      l.warn('CHECK "' + check.name + '" of Suite "' + suite.name + '" is WARNING: ' + result.value)
    } else {
      l.notice('CHECK "' + check.name + '" of Suite "' + suite.name + '" is OK: ' + result.value)
    }
  }
}
fs.writeFileSync(config.statusFile, JSON.stringify(status))
l.info('Check Done')
