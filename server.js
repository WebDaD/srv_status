let port = process.argv[3] || 3000
let file = process.argv[2]
let http = require('http')
let fs = require('fs')
let server = http.createServer(function (req, res) {
  if (req.method === 'GET') {
    fs.readFile(file, 'utf8', function (error, data) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', '*')
      if (error) {
        console.error(error)
        res.writeHead(501, {'Content-Type': 'text/json'})
        res.write(error)
        res.end()
      } else {
        res.writeHead(200, {'Content-Type': 'text/json'})
        res.write(data)
        res.end()
      }
    })
  }
})
server.listen(port)
console.log('Listening on Port ' + port)
