const client = require('../connectDB');

class University {
    async fetchAllUniversities() {
        const query = {
            text: `select * from University;`
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = University;