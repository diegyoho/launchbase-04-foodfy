const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const site = require('./app/controllers/site')

routes.get('/', site.home)
routes.get('/about', function (req, res) {
    res.render('site/about')
})
routes.get('/recipes', site.recipes)
routes.get('/recipes/:id', site.showRecipe)

routes.get("/admin", function (req, res) {
    res.redirect('/admin/recipes')
})
routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)
routes.post("/admin/recipes", recipes.post)
routes.put("/admin/recipes", recipes.put)
routes.delete("/admin/recipes", recipes.delete)

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)
routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)

routes.use(function (req, res) {
    res.status(404).render('not-found')
})

module.exports = routes