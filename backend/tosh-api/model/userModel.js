const client = require('../connectDB');

class User {
    async searchUser(valueToSearch, columnTarget){
        const query = {
            text: `select * from "User" where ${columnTarget} = $1;`,
            values: [valueToSearch]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchAll() {
        const query = {
            text: `select * from "User";`
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetch(offset, limit) {
        const query = {
            text: `select * from "User" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = User;