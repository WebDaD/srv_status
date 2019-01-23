let port = process.argv[2] || 9000
let http = require('http')
let url = require('url')
let server = http.createServer(function (req, res) {
  console.log('request')
  let parsedUrl = url.parse(req.url)
  let pathname = `.${parsedUrl.pathname}`
  if (req.method === 'GET') {
    switch (pathname) {
      case './fast':
        res.writeHead(200, {'Content-Type': 'text/json'})
        res.write(JSON.stringify({ hello: 'world' }))
        res.end()
        break
      case './medium':
        setTimeout(function () {
          res.writeHead(200, {'Content-Type': 'text/json'})
          res.write(JSON.stringify({ hello: 'world' }))
          res.end()
        }, 500)
        break
      case './slow':
        setTimeout(function () {
          res.writeHead(200, {'Content-Type': 'text/json'})
          res.write(JSON.stringify({ hello: 'world' }))
          res.end()
        }, 1000)
        break
      default:
        res.writeHead(500, {'Content-Type': 'text/json'})
        res.write(JSON.stringify({ hello: 'world' }) + ' > ' + pathname)
        res.end()
        break
    }
  }
})
try {
  server.listen(port)
} catch (e) {
  console.error(e)
}
