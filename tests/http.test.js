/* global it, describe, before, after */

const checkHTTP = require('../lib/http.js')
const assert = require('assert')
const syncRequest = require('sync-request')
const spawn = require('child_process').spawn

describe('Testing Check "http"', function () {
  var server
  before(function (done) {
    server = spawn('node', ['./tests/httpMock.js', '9000'])
    setTimeout(function () {
      done()
    }, 500)
  })

  after(function (done) {
    server.kill('SIGHUP')
    setTimeout(function () {
      done()
    }, 500)
  })

  it('should throw an error if the type is not http', function () {
    try {
      checkHTTP({
        name: 'test',
        type: 'something',
        target: 'http://website.eu',
        warning: '2',
        critical: '15'
      }, syncRequest)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if URL is reachable and response time is below warning and critical', function () {
    let status = checkHTTP({
      name: 'test',
      type: 'http',
      target: 'http://localhost:9000/fast',
      warning: '0.45',
      critical: '0.95'
    }, syncRequest)
    assert.equal(status.status, 'OK')
  })
  it('should return status WARN if URL is reachable and response time is between warning and critical', function () {
    let status = checkHTTP({
      name: 'test',
      type: 'http',
      target: 'http://localhost:9000/medium',
      warning: '0.45',
      critical: '0.95'
    }, syncRequest)
    assert.equal(status.status, 'WARN')
  })
  it('should return status CRIT if URL is reachable and response time is above critical', function () {
    let status = checkHTTP({
      name: 'test',
      type: 'http',
      target: 'http://localhost:9000/slow',
      warning: '0.45',
      critical: '0.95'
    }, syncRequest)
    assert.equal(status.status, 'CRIT')
  })
  it('should return status CRIT if URL is not reachable', function () {
    let status = checkHTTP({
      name: 'test',
      type: 'http',
      target: 'http://localhost:9000/error',
      warning: '0.45',
      critical: '0.95'
    }, syncRequest)
    assert.equal(status.status, 'CRIT')
  })
})
