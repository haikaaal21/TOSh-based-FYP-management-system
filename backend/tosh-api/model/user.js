const client = require('../connectDB');

class User {
    async searchUser(valueToSearch, columnTarget){
        const query = {
            name: 'search-user',
            text: `select * from "User" where ${columnTarget} = $1;`,
            values: [valueToSearch]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchAll() {
        const query = {
            name: 'fetch-all-users',
            text: `select * from "User";`
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = User;