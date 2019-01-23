module.exports = function (check, libxmljs, fs) {
  if (check.type !== 'xml') {
    throw new Error('Wrong Type for Check xml: ' + check.type)
  } else {
    try {
      let xml = fs.readFileSync(check.target, 'utf8')
      libxmljs.parseXml(xml)
      return {
        status: 'OK',
        value: true
      }
    } catch (e) {
      return {
        status: 'CRIT',
        value: false
      }
    }
  }
}
