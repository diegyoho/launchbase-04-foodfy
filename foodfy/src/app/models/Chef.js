const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`
            SELECT chefs.*, count(recipes.id) AS recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id`)
    },
    create(data) {
        const query = `
            INSERT INTO chefs (
                file_id,
                name
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.file_id,
            data.name
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes.id) AS recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
    },
    findBy(filter) {
        return db.query(`
            SELECT *
            FROM chefs
            WHERE name ILIKE '%${filter}%'`)
    },
    update(data) {
        const query = `
            UPDATE chefs SET
                name=($1)
            WHERE id = $2
        `

        const values = [
            data.name,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    paginate(params) {
        let { filter, limit, offset } = params

        let totalQuery = `(
            SELECT count(*) FROM chefs
        ) AS total`

        let endQuery = `
            LIMIT ${limit} OFFSET ${offset}
        `

        if (filter) {
            const filterQuery = `
                WHERE name ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM chefs
                ${filterQuery}
            ) AS total`

            endQuery = `
                ${filterQuery}
                ${endQuery}
            `
        }

        const query = `
            SELECT chefs.*, ${totalQuery}
            FROM chefs
            ${endQuery}
        `

        return db.query(query)
    }
}