// TODO: load config.json
let config = {}
// TODO: use log.js

let status = JSON.parse(JSON.stringify(config))
delete status.statusFile
delete status.logFile

// TODO: log info start

for (let index = 0; index < config.checkSuites.length; index++) {
  const suite = config.checkSuites[index]
  for (let subindex = 0; subindex < suite.checks.length; subindex++) {
    const check = suite.checks[subindex]
    // TODO: check
    // TODO: result to logFile
    // TODO: result to statusJson status.checkSuites[index].checks[subindex].status / .result
    // TODO: set status.checkSuites[index].status
    // TODO: set status.status
  }
}

// TODO: write statusJSON to file

// TODO: log info end
