const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.name ILIKE '%${filter}%'`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
            WHERE id = $7
        `

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = ${id}`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    paginate(params, callback) {
        let { filter, limit, offset } = params

        let totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`

        let endQuery = `
            LIMIT ${limit} OFFSET ${offset}
        `

        if (filter) {
            const filterQuery = `
                WHERE name ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`

            endQuery = `
                ${filterQuery}
                ${endQuery}
            `
        }

        const query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${endQuery}
        `

        db.query(query, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    }
}