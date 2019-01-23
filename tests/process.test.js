/* global it, describe */

const loadProcess = require('../lib/process.js')
const assert = require('assert')
let execSync = function (cmd) {
  if (cmd === 'ps aux | grep "[r]unning"') {
    return 'many lines'
  } else {
    return ''
  }
}

describe('Testing Check "process"', function () {
  it('should throw an error if the type is not process', function () {
    try {
      loadProcess({
        name: 'test',
        type: 'something',
        target: 'running'
      }, execSync)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if target is running', function () {
    let status = loadProcess({
      name: 'test',
      type: 'process',
      target: 'running'
    }, execSync)
    assert.equal(status.status, 'OK')
  })
  it('should return status CRIT if target is not running', function () {
    let status = loadProcess({
      name: 'test',
      type: 'process',
      target: 'notRunning'
    }, execSync)
    assert.equal(status.status, 'CRIT')
  })
})
