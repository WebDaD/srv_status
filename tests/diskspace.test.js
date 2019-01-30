/* global it, describe */

const checkDiskspace = require('../checks/diskspace.js')
const assert = require('assert')
const bytes = require('bytes')
let diskusage = {
  checkSync: function (target) {
    return {
      free: 10 * 1024 * 1024 * 1024 // 10 GB
    }
  }
}

describe('Testing Check "diskspace"', function () {
  it('should throw an error if the type is not diskspace', function () {
    try {
      checkDiskspace({
        name: 'test',
        type: 'something',
        target: '/',
        warning: '2GB',
        critical: '500MB'
      }, diskusage, bytes)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if value is above warning and critical', function () {
    let status = checkDiskspace({
      name: 'test',
      type: 'diskspace',
      target: '/',
      warning: '2GB',
      critical: '500MB'
    }, diskusage, bytes)
    assert.equal(status.status, 'OK')
  })
  it('should return status WARN if value is between warning and critical', function () {
    let status = checkDiskspace({
      name: 'test',
      type: 'diskspace',
      target: '/',
      warning: '12GB',
      critical: '500MB'
    }, diskusage, bytes)
    assert.equal(status.status, 'WARN')
  })
  it('should return status CRIT if value is below critical', function () {
    let status = checkDiskspace({
      name: 'test',
      type: 'diskspace',
      target: '/',
      warning: '12GB',
      critical: '11GB'
    }, diskusage, bytes)
    assert.equal(status.status, 'CRIT')
  })
})
