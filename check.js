const fs = require('fs')
const path = require('path')
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

config.statusFile = path.resolve(config.statusFile)
if (!fs.lstatSync(config.statusFile).isFile()) {
  l.error(config.statusFile + ' is not a File...')
  process.exit(3)
}
try {
  fs.accessSync(config.statusFile, this.fs.constants.R_OK | this.fs.constants.W_OK)
} catch (err) {
  try {
    fs.writeFileSync(config.statusFile, '')
  } catch (err) {
    l.error('Could not Create File ' + this.options.file + '\n' + err.toString())
    process.exit(4)
  }
}

let checks = {}
let checkFiles = fs.readdirSync('./checks/')
for (let index = 0; index < checkFiles.length; index++) {
  const checkFile = checkFiles[index]
  checks[checkFile] = require('./checks/' + checkFile + '.js')
}

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
    try {
      result = checks[check.type](check)
    } catch (error) {
      l.error('CHECK "' + check.name + '" of Suite "' + suite.name + '" Type is not valid: ' + check.type)
      continue
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
