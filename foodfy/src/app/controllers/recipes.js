const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 8

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

            return res.render('admin/recipes/index', { recipes, pagination })
        } catch(err) {
            throw new Error(err)
        }
    },
    async create(req, res) {
        try {
            const chefs = (await Chef.all()).rows

            return res.render('admin/recipes/create', { chefs })
        } catch(err) {
            throw new Error(err)
        }
    },
    async post(req, res) {
        try {
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

            const recipe = (await Recipe.create(data)).rows[0]

            return res.redirect(`/admin/recipes/${recipe.id}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async show(req, res) {
        try {
            const { id } = req.params

            let recipe = (await Recipe.find(id)).rows[0]

            if (!recipe) return res.send('Recipe not found!')

            recipe = {
                ...recipe,
                created_at: date(recipe.created_at).format
            }

            return res.render('admin/recipes/show', { recipe })
        } catch(err) {
            throw new Error(err)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            const recipe = (await Recipe.find(id)).rows[0]

            if (!recipe) return res.send('Recipe not found!')

            const chefs = (await Chef.all()).rows

            return res.render('admin/recipes/edit', { recipe, chefs })
        } catch(err) {
            throw new Error(err)
        }
    },
    async put(req, res) {
        try {
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

            await Recipe.update(data)

            return res.redirect(`/admin/recipes/${id}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body

            await Recipe.delete(id)

            return res.redirect('/admin/recipes')
        } catch(err) {
            throw new Error(err)
        }
    }
}