const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        let { page } = req.query

        page = page || 1
        const limit = 9

        let offset = limit * (page - 1)

        const params = {
            limit,
            offset
        }

        Recipe.paginate(params, function (recipes) {
            const pagination = {
                totalPages: recipes.lenght > 0 ? Math.ceil(recipes[0].total / limit) : 0,
                page
            }

            return res.render('admin/recipes/index', { recipes, pagination })
        })
    },
    create(req, res) {
        Chef.all(function (chefs) {
            return res.render('admin/recipes/create', { chefs })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (const key of keys) {
            if (req.body[key] === "")
                return res.send('Please, fill all fields!')
        }

        const {
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information
        } = req.body

        const data = [
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            date(Date.now()).iso
        ]

        Recipe.create(data, function (recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    show(req, res) {
        const { id } = req.params

        Recipe.find(id, function (recipe) {
            if (!recipe) return res.send('Recipe not found!')

            recipe = {
                ...recipe,
                created_at: date(recipe.created_at).format
            }
            return res.render('admin/recipes/show', { recipe })
        })
    },
    edit(req, res) {
        const { id } = req.params

        Recipe.find(id, function (recipe) {
            if (!recipe) return res.send('Recipe not found!')

            Chef.all(function (chefs) {
                return res.render('admin/recipes/edit', { recipe, chefs })
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (const key of keys) {
            if (req.body[key] === "")
                return res.send('Please, fill all fields')
        }

        const {
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            id
        } = req.body

        const data = [
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            id
        ]

        Recipe.update(data, function () {
            return res.redirect(`/admin/recipes/${id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body

        Recipe.delete(id, function () {
            return res.redirect('/admin/recipes')
        })
    }
}