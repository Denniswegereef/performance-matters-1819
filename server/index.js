const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const chalk = require('chalk')

var shrinkRay = require('shrink-ray')

const api = require('./helpers/api.js')
const clean = require('./helpers/clean-data.js')

const app = express()

// Compress
var compression = require('compression')
app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  express.static(__dirname + '/dist', {
    maxAge: '365d',
    lastModified: '',
    etag: ''
  })
)

app.use(shrinkRay())

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
