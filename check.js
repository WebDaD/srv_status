const fs = require('fs')
try {
  if (process.argv && process.argv.length > 2) {
    fs.accessSync(process.argv[2], fs.constants.R_OK)
  } else {
    console.error('Please give a Config!')
    process.exit(1)
  }
} catch (err) {
  console.error(process.argv[2] + ' does not exist or is not readable')
  process.exit(2)
}
let config = require(process.argv[2])

const Log = require('lib-log')
const l = new Log(config.log)

const os = require('os')
const diskusage = require('diskusage')
const bytes = require('bytes')
const { execSync } = require('child_process')
const libxmljs = require('libxmljs')
const syncRequest = require('sync-request')
const moment = require('moment')

const checkLoad = require('./lib/load.js')
const checkDiskspace = require('./lib/diskspace.js')
const checkPing = require('./lib/ping.js')
const checkProcess = require('./lib/process.js')
const checkXML = require('./lib/xml.js')
const checkHTTP = require('./lib/http.js')
const checkFileAge = require('./lib/fileage.js')
const checkLogTime = require('./lib/logtime.js')

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
      case 'diskspace': result = checkDiskspace(check, diskusage, bytes); break
      case 'ping': result = checkPing(check, execSync); break
      case 'process': result = checkProcess(check, execSync); break
      case 'xml': result = checkXML(check, libxmljs, fs); break
      case 'http': result = checkHTTP(check, syncRequest); break
      case 'fileage': result = checkFileAge(check, fs); break
      case 'logtime': result = checkLogTime(check, fs, moment); break
      default: l.error('CHECK "' + check.name + '" of Suite "' + suite.name + '" Type is not valid: ' + check.type); continue
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
