/* global it, describe */

const checkLogTime = require('../lib/logtime.js')
const assert = require('assert')
const moment = require('moment')
const fs = require('fs')

describe('Testing Check "logtime"', function () {
  it('should throw an error if the type is not logtime', function () {
    try {
      checkLogTime({
        name: 'text',
        type: 'something',
        target: './tests/good.log',
        regex: '\\[(.+)\\] a Line',
        format: 'YYYY-MM-DD HH:mm:ss',
        warning: '420',
        critical: '900'
      }, fs, moment)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if Age of last Line is below warning and critical', function () {
    fs.writeFileSync('./tests/good.log', '[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] a Line')
    let status = checkLogTime({
      name: 'text',
      type: 'logtime',
      target: './tests/good.log',
      regex: '\\[(.+)\\] a Line',
      format: 'YYYY-MM-DD HH:mm:ss',
      warning: '420',
      critical: '900'
    }, fs, moment)
    assert.equal(status.status, 'OK')
  })
  it('should return status WARN if Age of last Line is between warning and critical', function () {
    fs.writeFileSync('./tests/good.log', '[' + moment().subtract(450, 's').format('YYYY-MM-DD HH:mm:ss') + '] a Line')
    let status = checkLogTime({
      name: 'text',
      type: 'logtime',
      target: './tests/good.log',
      regex: '\\[(.+)\\] a Line',
      format: 'YYYY-MM-DD HH:mm:ss',
      warning: '420',
      critical: '900'
    }, fs, moment)
    assert.equal(status.status, 'WARN')
  })
  it('should return status CRIT if Age of last Line is above critical', function () {
    fs.writeFileSync('./tests/good.log', '[' + moment().subtract(950, 's').format('YYYY-MM-DD HH:mm:ss') + '] a Line')
    let status = checkLogTime({
      name: 'text',
      type: 'logtime',
      target: './tests/good.log',
      regex: '\\[(.+)\\] a Line',
      format: 'YYYY-MM-DD HH:mm:ss',
      warning: '420',
      critical: '900'
    }, fs, moment)
    assert.equal(status.status, 'CRIT')
  })
  it('should return status CRIT if no Line was found', function () {
    let status = checkLogTime({
      name: 'text',
      type: 'logtime',
      target: './tests/bad.log',
      regex: '\\[(.+)\\] a Line',
      format: 'YYYY-MM-DD HH:mm:ss',
      warning: '420',
      critical: '900'
    }, fs, moment)
    assert.equal(status.status, 'CRIT')
  })
})
