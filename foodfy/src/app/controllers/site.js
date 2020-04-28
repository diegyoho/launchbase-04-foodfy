const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async home(req, res) {
        const params = {
            limit: 6,
            offset: 0
        }

        const recipes = (await Recipe.paginate(params)).rows

        return res.render('site/home', { recipes })
    },
    async recipes(req, res) {
        let { page } = req.query

        page = page || 1
        const limit = 9

        let offset = limit * (page - 1)

        const params = {
            limit,
            offset
        }

        const recipes = (await Recipe.paginate(params)).rows

        const pagination = {
            totalPages: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0,
            page
        }

        return res.render('site/recipes', { recipes, pagination })
    },
    async showRecipe(req, res) {
        const { id } = req.params

        let recipe = (await Recipe.find(id)).rows[0]

        if (!recipe) return res.send('Recipe not found!')

        recipe = {
            ...recipe,
            created_at: date(recipe.created_at).format
        }

        return res.render('site/recipe', { recipe })
    },
    async chefs(req, res) {
        const chefs = (await Chef.all()).rows

        return res.render('site/chefs', { chefs })
    },
    async search(req, res) {
        let { filter } = req.query

        const recipes = (await Recipe.findBy(filter)).rows

        return res.render('site/search-recipes', { recipes, filter })
    }
}