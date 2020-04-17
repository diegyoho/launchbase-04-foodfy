const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/recipes')
const data = require('./data')

routes.get('/', function (req, res) {

    const mostAccessed = []

    for (let i = 0; i < 6; ++i) {
        mostAccessed.push(data[i])
    }

    res.render('home', { recipes: mostAccessed })
})

routes.get('/about', function (req, res) {
    res.render('about')
})

routes.get('/recipes', function (req, res) {
    res.render('recipes', { recipes: data })
})

routes.get('/recipes/:id', function (req, res) {
    res.render('recipe-details', { recipe: data[req.params.id] })
})

routes.get("/admin", function (req, res) {
    res.redirect('/admin/recipes')
})
routes.get("/admin/recipes", recipes.index) // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/admin/recipes", recipes.post) // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put) // Editar uma receita
routes.delete("/admin/recipes", recipes.delete) // Deletar uma receita

routes.use(function (req, res) {
    res.status(404).render('not-found')
})

module.exports = routes