module.exports = function (check, execSync) {
  if (check.type !== 'port') {
    throw new Error('Wrong Type for Check port: ' + check.type)
  } else {
    try {
      execSync = (typeof execSync === 'undefined') ? require('child_process').execSync : execSync
      execSync('nc -z ' + check.target + ' ' + check.port)
      return {
        status: 'OK',
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
