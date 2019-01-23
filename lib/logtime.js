module.exports = function (check, fs, moment) {
  if (check.type !== 'logtime') {
    throw new Error('Wrong Type for Check logtime: ' + check.type)
  } else {
    try {
      let status = 'OK'
      const contents = fs.readFileSync(check.target, 'utf8')
      var regexp = new RegExp(check.regex, 'gmi')
      var matches = regexp.exec(contents)
      if (matches.length < 1) {
        return {
          status: 'CRIT',
          value: 'No Matches in Log'
        }
      }
      var lastTimeStamp = matches[matches.length - 1]
      let ts = moment(lastTimeStamp, check.format).toDate()
      let now = new Date()
      let age = now - ts
      if (age >= check.warning * 1000) {
        status = 'WARN'
      }
      if (age >= check.critical * 1000) {
        status = 'CRIT'
      }
      return {
        status: status,
        value: age
      }
    } catch (e) {
      return {
        status: 'CRIT',
        value: 'Could not read Logfile'
      }
    }
  }
}
