module.exports = function (check, fs) {
  if (check.type !== 'fileage') {
    throw new Error('Wrong Type for Check fileage: ' + check.type)
  } else {
    try {
      fs = (typeof fs === 'undefined') ? require('fs') : fs
      let status = 'OK'
      const stats = fs.statSync(check.target)
      let now = new Date()
      let age = now - stats.mtime
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
        value: 'Could not read File'
      }
    }
  }
}
