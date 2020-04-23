const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
            SELECT *
            FROM chefs`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`SELECT * FROM chefs WHERE id = ${id}`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
            SELECT *
            FROM chefs
            WHERE name ILIKE '%${filter}%'`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name=($1),
                avatar_url=($2),
            WHERE id = $3
        `

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = ${id}`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    paginate(params, callback) {
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

        db.query(query, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    }
}