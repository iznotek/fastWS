const path = require('path')
const fs = require('fs')
const http = require('http')

module.exports = function (app) {

  app.ws('/fast-ws', ws => {
    ws.on('echo', ({ reply, data }) => {
      reply(data)
    })
  })

  app.ws('/echo', ws => null, { protocol: 'echo' })

  app.post('/post', async (req, res) => {
    const data = await req.body()
    res.json(data)
  })

  app.get('/param/:data', (req, res, { data }) => {
    res.end(data)
  })

  app.get('/xml/:message', (req, res, { message }) => {
    res.render('<message>${escapeHTML(message)}</message>', { message })
  })

  app.get('/js/:message', (req, res, { message }) => {
    res.render('response("${escapeVar(message, String)}")', { message })
  })

  app.get('/stream/file', (req, res) => {
    fs.createReadStream(path.resolve('static/index.html')).pipe(res)
  })

  app.get('/stream/http', (req, res) => {
    http.get('http://google.com/', response => {
      response.pipe(res)
    })
  })

  app.serve('/*')

  return app

}