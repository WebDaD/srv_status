/* global it, describe, beforeEach, afterEach */

const loadCheck = require('../lib/load.js')
const assert = require('assert')
let os = {
  loadavg: function () {
    return [0.5, 1.0, 0.7]
  }
}

describe('Testing Check "load"', function () {
  it('should throw an error if the type is not load', function() {
    try {
      loadCheck({
        name: 'test',
        type: 'something',
        warning: 0.8,
        critical: 1.0
      }, os)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if value is below warning and critical', function () {
    let status = loadCheck({
      name: 'test',
      type: 'load',
      warning: 0.8,
      critical: 1.0
    }, os)
    assert.equal(status.status, 'OK')
  })
  it('should return status WARN if value is between warning and critical', function () {
    let status = loadCheck({
      name: 'test',
      type: 'load',
      warning: 0.5,
      critical: 1.0
    }, os)
    assert.equal(status.status, 'WARN')
  })
  it('should return status CRIT if value is above critical', function () {
    let status = loadCheck({
      name: 'test',
      type: 'load',
      warning: 0.3,
      critical: 0.5
    }, os)
    assert.equal(status.status, 'CRIT')
  })
})
