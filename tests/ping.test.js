/* global it, describe */

const loadPing = require('../checks/ping.js')
const assert = require('assert')
let execSync = function (cmd) {
  if (cmd === 'ping -c 1 -W 2 1.1.1.1') {
    return true
  } else {
    throw new Error('Error')
  }
}

describe('Testing Check "ping"', function () {
  it('should throw an error if the type is not ping', function () {
    try {
      loadPing({
        name: 'test',
        type: 'something',
        target: '1.1.1.1'
      }, execSync)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if target is reachable', function () {
    let status = loadPing({
      name: 'test',
      type: 'ping',
      target: '1.1.1.1'
    }, execSync)
    assert.equal(status.status, 'OK')
  })
  it('should return status CRIT if target is not reachable', function () {
    let status = loadPing({
      name: 'test',
      type: 'ping',
      target: '0.0.0.0'
    }, execSync)
    assert.equal(status.status, 'CRIT')
  })
})
