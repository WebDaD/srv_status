const fs = require('fs')
try {
  if (process.argv && process.argv.length > 2) {
    fs.accessSync(process.argv[2], fs.constants.R_OK | fs.constants.W_OK)
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

const execSync = require('child_process').execSync
l.info('Action Start')
for (let index = 0; index < config.checkSuites.length; index++) {
  const suite = config.checkSuites[index]
  for (let subindex = 0; subindex < suite.checks.length; subindex++) {
    const check = suite.checks[subindex]
    if (check.status === 'WARN') {
      if (check.warning.actions && check.warning.actions.length > 0) {
        check.warning.actionCounter = (typeof check.warning.actionCounter === 'undefined') ? 0 : check.warning.actionCounter++
        if (check.warning.actionCounter === check.warning.actions.length) {
          l.error(check.name + ': Out of Actions for WARN ...')
          continue
        }
        if (check.warning.actionCounter >= check.warning.actions.length) {
          continue
        }
        l.info(check.name + ': Perfoming "' + check.warning.actions[check.warning.actionCounter] + '"')
        execSync(check.warning.actions[check.warning.actionCounter])
      }
    }
    if (check.status === 'CRIT') {
      if (check.critical.actions && check.critical.actions.length > 0) {
        check.critical.actionCounter = (typeof check.critical.actionCounter === 'undefined') ? 0 : check.critical.actionCounter++
        if (check.critical.actionCounter === check.critical.actions.length) {
          l.error(check.name + ': Out of Actions for CRIT ...')
          continue
        }
        if (check.critical.actionCounter >= check.critical.actions.length) {
          continue
        }
        l.info(check.name + ': Perfoming "' + check.critical.actions[check.critical.actionCounter] + '"')
        execSync(check.critical.actions[check.critical.actionCounter])
      }
    }
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(config))
l.info('Action Done')
