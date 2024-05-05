const client = require('../connectDB');

class Batch {
    async fetchAllBatches() {
        const query = {
            text: `select * from "Batch";`
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetch(offset, limit) {
        const query = {
            text: `select * from "Batch" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchSpecifiedBatch(batchID) {
        const query = {
            text: `select * from "Batch" where batchid = $1;`,
            values: [batchID]
        }
        const res = await client.query(query);
        return res.rows[0];
    }
}

module.exports = Batch;