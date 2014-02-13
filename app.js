var app = require('http').createServer(handler)
  , fs  = require('fs')
  , io  = require('socket.io').listen(app, { log: false })
  , D   = require('daimio')
  // , mongo = require('mongodb')
  // , db  = new mongo.Db('tiletown', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {w: 0});

// D.Etc.db = db // expose DB connection to Daimio

function handler (req, res) {
  // NOTE: we're grabbing these fresh in response to each request for development. DO NOT DO THIS IN PRODUCTION.
  // move these lines outside the handler so the html is cached over the lifetime of the server.
  var index_html   = fs.readFileSync(__dirname+'/index.html', 'utf8')
    , daimio_js   = fs.readFileSync(__dirname+'/daimio_composite.js', 'utf8')

  if(req.url.match(/^\/public\//)) {
    try {
      res.writeHead(200)
      res.end(fs.readFileSync('.' + req.url, 'utf8')) // TODO: async this
    } catch(e) {}
    return
  }

  if(req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }

  if(req.url === '/daimio_composite.js') {
    res.writeHead(200, {"Content-Type": "application/javascript"})
    res.end(daimio_js)
    return
  }

  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(index_html)
}

io.on('connection', function (socket) {
  socket.on('bounce', function (data) {
    io.sockets.in(data.game).emit('bounced', data.room)
  })
})

app.listen(8888)

