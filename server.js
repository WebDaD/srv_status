let port = process.argv[3] || 3000
let file = process.argv[2]
let http = require('http')
let fs = require('fs')
let server = http.createServer(function (req, res) {
  if (req.method === 'GET') {
    fs.readFile(file, function (error, data) {
      if (error) {
        console.error(error)
        res.writeHead(501, {'Content-Type': 'application/json'})
        res.send(JSON.parse(error))
      } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.send(JSON.parse(data))
      }
    })
  }
})
server.listen(port)
console.log('Listening on Port ' + port)
