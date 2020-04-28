const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        const chefs = (await Chef.all()).rows

        return res.render('admin/chefs/index', { chefs })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (const key of keys) {
            if (req.body[key] === "")
                return res.send('Please, fill all fields!')
        }

        const {
            name,
            avatar_url
        } = req.body

        const data = [
            name,
            avatar_url,
            date(Date.now()).iso
        ]

        const chef = (await Chef.create(data)).rows[0]

        return res.redirect(`/admin/chefs/${chef.id}`)
    },
    async show(req, res) {
        const { id } = req.params

        let chef = (await Chef.find(id)).rows[0]

        if (!chef) return res.send('Chef not found!')

        chef = {
            ...chef,
            created_at: date(chef.created_at).format
        }
        
        const recipes = (await Recipe.allBy(chef.id)).rows

        return res.render('admin/chefs/show', { chef, recipes })
    },
    async edit(req, res) {
        const { id } = req.params

        const chef = (await Chef.find(id)).rows[0]

        if (!chef) return res.send('Chef not found!')

        return res.render('admin/chefs/edit', { chef })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (const key of keys) {
            if (req.body[key] === "")
                return res.send('Please, fill all fields')
        }

        const {
            name,
            avatar_url,
            id
        } = req.body

        const data = [
            name,
            avatar_url,
            id
        ]

        await Chef.update(data)

        return res.redirect(`/admin/chefs/${id}`)
    },
    async delete(req, res) {
        const { id } = req.body

        await Chef.delete(id)

        return res.redirect('/admin/chefs')
    }
}