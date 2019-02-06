module.exports = function (check, syncRequest) {
  if (check.type !== 'rabbitmqAlive') {
    throw new Error('Wrong Type for Check rabbitmqAlive: ' + check.type)
  } else {
    try {
      syncRequest = (typeof syncRequest === 'undefined') ? require('sync-request') : syncRequest
      let start = new Date()
      let res = syncRequest('GET', 'http://' + check.target + ':15672/api/aliveness-test/%2F', {
        timeout: check.critical * 1000,
        headers: {
          'authorization': 'Basic Z3Vlc3Q6Z3Vlc3Q='
        }
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
        value: '500 [' + check.critical * 1000 + 'ms]' + ': ' + e.toString()
      }
    }
  }
}
