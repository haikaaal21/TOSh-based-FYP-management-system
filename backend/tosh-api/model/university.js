const client = require('../connectDB');

class University {
    async fetchAllUniversities() {
        const query = {
            name: 'fetch-all-universities',
            text: `select * from University;`
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = University;