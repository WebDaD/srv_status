module.exports = function (check, os) {
  if (check.type !== 'load') {
    throw new Error('Wrong Type for Check load: ' + check.type)
  } else {
    let loadAvg = os.loadavg()[0] // [1min, 5min, 15min]
    let status = 'OK'
    if (loadAvg >= check.warning) {
      status = 'WARN'
    }
    if (loadAvg >= check.critical) {
      status = 'CRIT'
    }

    return {
      status: status,
      value: loadAvg
    }
  }
}
