const express = require('express')
const nunjuks = require('nunjucks')

const server = express()

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjuks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.get('/', function (req, res) {
    res.render('home')
})

server.get('/about', function (req, res) {
    res.render('about')
})

server.get('/recipes', function (req, res) {
    res.render('recipes')
})

server.use(function (req, res) {
    res.status(404).render('not-found')
})

server.listen(5000, function () {
    console.log('Server is running on port: 5000')
    console.log('Application can be accessed at the address: http://localhost:5000')
})