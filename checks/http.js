module.exports = function (check, syncRequest) {
  if (check.type !== 'http') {
    throw new Error('Wrong Type for Check http: ' + check.type)
  } else {
    try {
      syncRequest = (typeof syncRequest === 'undefined') ? require('sync-request') : syncRequest
      let start = new Date()
      let res = syncRequest('GET', check.target, {
        timeout: check.critical * 1000
      })
      let stop = new Date()
      let time = stop - start // milliseconds
      if (res.statusCode === 200) {
        let status = 'OK'
        if (time >= check.warning * 1000) {
          status = 'WARN'
        }
        if (time >= check.critical * 1000) {
          status = 'CRIT'
        }
        return {
          status: status,
          value: 200 + ' [' + time + 'ms]'
        }
      } else {
        return {
          status: 'CRIT',
          value: res.statusCode + ' [' + time + 'ms]' + ': ' + res.body
        }
      }
    } catch (e) {
      return {
        status: 'CRIT',
        value: '500 [' + check.critical * 1000 + 'ms]' + ': Timeout'
      }
    }
  }
}
