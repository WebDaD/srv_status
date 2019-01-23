module.exports = function (check, execSync) {
  if (check.type !== 'ping') {
    throw new Error('Wrong Type for Check ping: ' + check.type)
  } else {
    try {
      execSync('ping -c 1 -W 2 ' + check.target)
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
