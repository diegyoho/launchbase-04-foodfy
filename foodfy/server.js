// Import dependencies
const express = require('express')
const nunjuks = require('nunjucks')
const recipes = require('./data')

// Configure

const server = express()

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjuks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

// Routes

server.get('/', function (req, res) {

    const mostAccessed = []

    for (let i = 0; i < 6; ++i) {
        mostAccessed.push(recipes[i])
    }

    res.render('home', { recipes: mostAccessed })
})

server.get('/about', function (req, res) {
    res.render('about')
})

server.get('/recipes', function (req, res) {
    res.render('recipes', { recipes })
})

server.use(function (req, res) {
    res.status(404).render('not-found')
})

// Start server
server.listen(5000, function () {
    console.log('Server is running on port: 5000')
    console.log('Application can be accessed at the address: http://localhost:5000')
})