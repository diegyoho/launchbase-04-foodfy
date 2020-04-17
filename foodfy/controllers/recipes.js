const fs = require('fs')
const data = require('../data')//require('../data.json')
// const { age, date, degree } = require('../utils')

exports.index = function (req, res) {
    return res.render('admin/index', { recipes: data })
}

exports.create = function (req, res) {
    return res.render('admin/create')
}

exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (const key of keys) {
        if (req.body[key] === "")
            return res.send('Por favor, preencha todos os campos!')
    }

    const { image, title, author, ingredients, preparation, information } = req.body

    let id = 1;
    if (data.recipes.length > 0)
        id = data.recipes[data.recipes.length - 1].id + 1

    const recipe = {
        id: Number(id),
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    }

    data.recipes.push(recipe)

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Erro na escrita do arquivo!")

        return res.redirect('/admin/recipes')
    })
}

exports.show = function (req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function (recipe) {
        return recipe.id == id
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = foundRecipe

    return res.render('admin/show', { recipe })
}

exports.edit = function (req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function (recipe) {
        return recipe.id == id
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = foundRecipe

    return res.render('admin/edit', { recipe })
}

exports.put = function (req, res) {
    const { id } = req.body
    let index = 0

    const foundRecipe = data.recipes.find(function (recipe, foundIndex) {
        if (recipe.id == id) {
            index = foundIndex
            return true
        }
    })

    if (!foundRecipe) return res.send('Receita não encontrada!')

    const recipe = {
        ...foundRecipe,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.recipes[index] = recipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Erro na escrita do arquivo!")

        return res.redirect(`/recipes/${id}`)
    })
}

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredrecipes = data.recipes.filter(function (recipe, foundIndex) {
        return recipe.id != id
    })

    data.recipes = filteredrecipes

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Erro na escrita do arquivo!")

        return res.redirect('/recipes')
    })
}