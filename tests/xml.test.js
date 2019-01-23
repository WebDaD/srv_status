/* global it, describe */

const loadXML = require('../lib/xml.js')
const assert = require('assert')
const fs = require('fs')
const libxmljs = require('libxmljs')

let fsMock = {
  readFileSync: function (file, utf) {
    if (file === '/some/good/file.xml') {
      return '<xml>'
    } else {
      return 'something'
    }
  }
}
let libxmljsMock = {
  parseXml: function (xml) {
    if (xml === '<xml>') {
      return true
    } else {
      throw new Error('argh')
    }
  }
}

describe('Testing Check "xml"', function () {
  it('should throw an error if the type is not xml', function () {
    try {
      loadXML({
        name: 'test',
        type: 'something',
        target: '1.1.1.1'
      }, libxmljsMock, fsMock)
      assert.fail('Should throw an error')
    } catch (e) {
      assert.equal(e.toString().indexOf('Wrong Type') > -1, true)
    }
  })
  it('should return status OK if xml file is well-formed (MOCK)', function () {
    let status = loadXML({
      name: 'test',
      type: 'xml',
      target: '/some/good/file.xml'
    }, libxmljsMock, fsMock)
    assert.equal(status.status, 'OK')
  })
  it('should return status CRIT if xml file is not well-formed (MOCK)', function () {
    let status = loadXML({
      name: 'test',
      type: 'xml',
      target: '/some/bad/file.xml'
    }, libxmljsMock, fsMock)
    assert.equal(status.status, 'CRIT')
  })
  it('should return status OK if xml file is well-formed', function () {
    let status = loadXML({
      name: 'test',
      type: 'xml',
      target: './tests/good.xml'
    }, libxmljs, fs)
    assert.equal(status.status, 'OK')
  })
  it('should return status CRIT if xml file is not well-formed', function () {
    let status = loadXML({
      name: 'test',
      type: 'xml',
      target: './tests/bad.xml'
    }, libxmljs, fs)
    assert.equal(status.status, 'CRIT')
  })
})
