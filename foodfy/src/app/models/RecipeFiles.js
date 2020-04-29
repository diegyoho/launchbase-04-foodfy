const db = require('../../config/db')
// const fs = require('fs')

module.exports = {
    create(data) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.recipe_id,
            data.file_id
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT *
            FROM files
            WHERE id = $1`, [id])
    },
    async delete(id) {

        try {
            // const file = (await db.query(`SELECT * FROM files WHERE id = $1`, [id])).rows[0]

            // fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM recipe_files
                WHERE file_id = $1
            `, [id])
        } catch(err) {
            throw new Error(err)
        }
    }
}