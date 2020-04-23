const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {
        Chef.all(function (chefs) {
            return res.render('admin/chefs/index', { chefs })
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
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

        Chef.create(data, function (chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res) {
        const { id } = req.params

        Chef.find(id, function (chef) {
            if (!chef) return res.send('Chef not found!')

            chef = {
                ...chef,
                created_at: date(chef.created_at).format
            }
            return res.render('admin/chefs/show', { chef })
        })
    },
    edit(req, res) {
        const { id } = req.params

        Chef.find(id, function (chef) {
            if (!chef) return res.send('Chef not found!')

            return res.render('admin/chefs/edit', { chef })
        })
    },
    put(req, res) {
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

        Chef.update(data, function () {
            return res.redirect(`/admin/chefs/${id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body

        Chef.delete(id, function () {
            return res.redirect('/admin/chefs')
        })
    }
}