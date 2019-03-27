const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const shrinkRay = require('shrink-ray-current')

const chalk = require('chalk')

const api = require('./helpers/api.js')
const clean = require('./helpers/clean-data.js')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  express.static(__dirname + '/dist', {
    maxAge: '365d',
    lastModified: '',
    etag: ''
  })
)

app.get(['js/*.js', 'css/*.css'], (req, res, next) => {
  const encoding = req.headers['accept-encoding']
  const extensionIndex = req.originalUrl.lastIndexOf('.')
  const extension = req.originalUrl.slice(extensionIndex)

  if (encoding && encoding.includes('br')) {
    req.url = `${req.url}.br`
    res.set('Content-Encoding', 'br')
  } else if (encoding && encoding.includes('gzip')) {
    req.url = `${req.url}.gz`
    res.set('Content-Encoding', 'gzip')
  }

  res.set('Content-Type', extension === '.js' ? 'text/javascript' : 'text/css')
  next()
})

app.use(shrinkRay())

// Compress
var compression = require('compression')
app.use(compression())

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  })
)

app.set('view engine', 'hbs')

app.set('views', __dirname + '/views')
// app.enable('view cache');

app.get('/', (req, res) => {
  res.render('index')
})

// Post requests
app.post('/search-song', (req, res) => {
  renderPage(req, res)
})

app.get('/search-song', (req, res) => {
  renderPage(req, res, 'drake')
})

app.get('/getSimilair/:artist', async (req, res) => {
  console.log(chalk.yellow(`Request to ${req.params.artist}`))
  let data = await api.search(req.params.artist)

  res
    .render('components/similair', { artist: data, layout: false })
    .then(html => {
      response.send({ html })
    })
})

app.get('/similar/:artist', async (req, res) => {
  renderPage(req, res)
})

async function renderPage(req, res, artist) {
  try {
    if (artist) {
      let data = await api.search(artist)
      res.render('discover', { artist: data })
      return
    }

    let data = await api.search(
      req.body.artist ? req.body.artist : req.params.artist
    )

    res.render('discover', {
      artist: data
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

app.get('*', function(req, res) {
  res.status(404).send('what???')
})

app.listen(8080)
