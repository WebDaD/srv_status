/* global it, describe */

const checkFileAge = require('../lib/fileage.js')
const assert = require('assert')
let fs = {
  date: new Date(),
  statSync: function (file) {
    return {
      mtime: this.date
    }
  }
}

describe('Testing Check "fileage"', function () {
  it('should throw an error if the type is not fileage', function () {
    try {
      checkFileAge({
        name: 'test',
        type: 'something',
        target: '/some/file.xml',
        warning: 10,
        critical: 20
      }, fs)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if age is below warning and critical', function () {
    fs.date = new Date()
    let status = checkFileAge({
      name: 'test',
      type: 'fileage',
      target: '/some/file.xml',
      warning: 10,
      critical: 20
    }, fs)
    assert.equal(status.status, 'OK')
  })
  it('should return status WARN if age is between warning and critical', function () {
    fs.date = new Date()
    fs.date.setSeconds(fs.date .getSeconds() - 15)
    let status = checkFileAge({
      name: 'test',
      type: 'fileage',
      target: '/some/file.xml',
      warning: 10,
      critical: 20
    }, fs)
    assert.equal(status.status, 'WARN')
  })
  it('should return status OK if age is above critical', function () {
    fs.date = new Date()
    fs.date.setSeconds(fs.date .getSeconds() - 25)
    let status = checkFileAge({
      name: 'test',
      type: 'fileage',
      target: '/some/file.xml',
      warning: 10,
      critical: 20
    }, fs)
    assert.equal(status.status, 'CRIT')
  })
})
