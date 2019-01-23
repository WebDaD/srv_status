module.exports = function (check, execSync) {
  if (check.type !== 'process') {
    throw new Error('Wrong Type for Check process: ' + check.type)
  } else {
    try {
      let cleanedTarget = '[' + check.target[0] + ']' + check.target.substr(1)
      let results = execSync('ps aux | grep "' + cleanedTarget + '"')
      return {
        status: results.length > 0 ? 'OK' : 'CRIT',
        value: true
      }
    } catch (e) {
      return {
        status: 'CRIT',
        value: false
      }
    }
  }
}
