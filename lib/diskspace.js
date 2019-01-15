module.exports = function (check, diskusage, bytes) {
  if (check.type !== 'diskspace') {
    throw new Error('Wrong Type for Check diskspace: ' + check.type)
  } else {
    let freeSpace = diskusage.checkSync(check.target).free
    let status = 'OK'
    if (freeSpace <= bytes.parse(check.warning)) {
      status = 'WARN'
    }
    if (freeSpace <= bytes.parse(check.critical)) {
      status = 'CRIT'
    }
    return {
      status: status,
      value: bytes.format(freeSpace)
    }
  }
}