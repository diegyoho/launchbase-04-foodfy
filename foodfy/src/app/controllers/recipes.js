const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFiles = require('../models/RecipeFiles')

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

            let recipes = (await Recipe.paginate(params)).rows
            const recipesTemp = []

            for(const recipe of recipes) {
                let files = (await Recipe.files(recipe.id)).rows

                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                }))

                recipesTemp.push({
                    ...recipe,
                    images: files
                })
            }

            recipes = recipesTemp

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

            if(req.files.length === 0) {
                return res.send('Please, send at least 1 photo!')
            }
    
            const filesPromise = req.files.map(file => File.create(file))
            const fileIds = await Promise.all(filesPromise)

            const recipeId = (await Recipe.create(req.body)).rows[0].id

            const recipeFilesPromisse = fileIds.map(fileId => RecipeFiles.create({
                recipe_id: recipeId,
                file_id: fileId.rows[0].id
            }))

            await Promise.all(recipeFilesPromisse)

            return res.redirect(`/admin/recipes/${recipeId}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async show(req, res) {
        try {
            const { id } = req.params

            let recipe = (await Recipe.find(id)).rows[0]

            if (!recipe) return res.send('Recipe not found!')

            let files = (await Recipe.files(recipe.id)).rows

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            recipe = {
                ...recipe,
                images: files
            }

            return res.render('admin/recipes/show', { recipe })
        } catch(err) {
            throw new Error(err)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            let recipe = (await Recipe.find(id)).rows[0]

            if (!recipe) return res.send('Recipe not found!')

            let files = (await Recipe.files(recipe.id)).rows

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            recipe = {
                ...recipe,
                images: files
            }

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

            if(req.body.removed_files) {
                const dbFiles = (await Recipe.files(req.body.id)).rows.length
                const rmFiles = req.body.removed_files.length
                
                if(req.files.length === 0 && dbFiles <= rmFiles) {
                    return res.send('Please, send at least 1 photo!')
                }
    
                let removedFilesPromise = req.body.removed_files.map(id => RecipeFiles.delete(id))
                await Promise.all(removedFilesPromise)
                
                removedFilesPromise = req.body.removed_files.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(req.body)

            const filesPromise = req.files.map(file => File.create(file))
            const fileIds = await Promise.all(filesPromise)

            const recipeFilesPromisse = fileIds.map(fileId => RecipeFiles.create({
                recipe_id: req.body.id,
                file_id: fileId.rows[0].id
            }))

            await Promise.all(recipeFilesPromisse)

            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body

            let files = (await Recipe.files(id)).rows

            let removedFilesPromise = files.map(file => RecipeFiles.delete(file.id))
            await Promise.all(removedFilesPromise)
            
            removedFilesPromise = files.map(file => File.delete(file.id))
            await Promise.all(removedFilesPromise)

            await Recipe.delete(id)

            return res.redirect('/admin/recipes')
        } catch(err) {
            throw new Error(err)
        }
    }
}