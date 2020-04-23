const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    home(req, res) {
        const params = {
            limit: 6,
            offset: 0
        }

        Recipe.paginate(params, function (recipes) {

            return res.render('site/home', { recipes })
        })
    },
    recipes(req, res) {
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
                totalPages: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0,
                page
            }

            return res.render('site/recipes', { recipes, pagination })
        })
    },
    showRecipe(req, res) {
        const { id } = req.params

        Recipe.find(id, function (recipe) {
            if (!recipe) return res.send('Recipe not found!')

            recipe = {
                ...recipe,
                created_at: date(recipe.created_at).format
            }
            return res.render('site/recipe', { recipe })
        })
    },
    chefs(req, res) {
        Chef.all(function (chefs) {
            return res.render('site/chefs', { chefs })
        })
    },
    search(req, res) {
        let { filter } = req.query

        Recipe.findBy(filter, function (recipes) {

            return res.render('site/search-recipes', { recipes, filter })
        })
    }
}