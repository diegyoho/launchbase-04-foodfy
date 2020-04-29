const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async home(req, res) {
        try {
            const params = {
                limit: 6,
                offset: 0
            }

            const recipes = (await Recipe.paginate(params)).rows

            return res.render('site/home', { recipes })
        } catch(err) {
            throw new Error(err)
        }
    },
    async recipes(req, res) {
        try {
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
        } catch(err) {
            throw new Error(err)
        }
    },
    async showRecipe(req, res) {
        try {
            const { id } = req.params
    
            let recipe = (await Recipe.find(id)).rows[0]
    
            if (!recipe) return res.send('Recipe not found!')
    
            recipe = {
                ...recipe,
                created_at: date(recipe.created_at).format
            }
    
            return res.render('site/recipe', { recipe })
        } catch(err) {
            throw new Error(err)
        }
    },
    async chefs(req, res) {
        try {
            let chefs = (await Chef.all()).rows
            const chefsTemp = []
            
            for (let chef of chefs){
                const file = (await File.find(chef.file_id)).rows[0]

                chefsTemp.push({
                    ...chef,
                    avatar_url: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                })
            }

            chefs = chefsTemp
    
            return res.render('site/chefs', { chefs })
        } catch(err) {
            throw new Error(err)
        }
    },
    async search(req, res) {
        try {
            let { filter } = req.query
    
            const recipes = (await Recipe.findBy(filter)).rows
    
            return res.render('site/search-recipes', { recipes, filter })
        } catch(err) {
            throw new Error(err)
        }
    }
}