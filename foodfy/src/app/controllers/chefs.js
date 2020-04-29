const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
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

            return res.render('admin/chefs/index', { chefs })
        } catch(err) {
            throw new Error(err)
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (const key of keys) {
                if (req.body[key] === "")
                    return res.send('Please, fill all fields!')
            }

            if(!req.file) {
                return res.send('Please, send 1 photo!')
            }

            const fileId = (await File.create(req.file)).rows[0].id

            const chefId = (await Chef.create({...req.body, file_id: fileId})).rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async show(req, res) {
        try {
            const { id } = req.params

            let chef = (await Chef.find(id)).rows[0]

            if (!chef) return res.send('Chef not found!')
            
            let recipes = (await Recipe.allBy(chef.id)).rows
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

            const file = (await File.find(chef.file_id)).rows[0]

            chef = {
                ...chef,
                avatar_url: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }

            return res.render('admin/chefs/show', { chef, recipes })
        } catch(err) {
            throw new Error(err)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params

            const chef = (await Chef.find(id)).rows[0]

            if (!chef) return res.send('Chef not found!')

            let file = (await File.find(chef.file_id)).rows[0]

            file = {
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }

            return res.render('admin/chefs/edit', { chef, file })
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
            
            if(req.file) {
                const chef = (await Chef.find(req.body.id)).rows[0]

                if (!chef) return res.send('Chef not found!')

                const fileId = chef.file_id
                await File.update({...req.file, id: fileId})
            }

            await Chef.update(req.body)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch(err) {
            throw new Error(err)
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body

            await Chef.delete(id)

            return res.redirect('/admin/chefs')
        } catch(err) {
            throw new Error(err)
        }
    }
}