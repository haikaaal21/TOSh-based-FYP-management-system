const { Client } = require('pg');
const config = require('config');

const dbConfig = config.get('test');
// const dbConfig = config.get('development');

const client = new Client(dbConfig);

client.connect((err) => {
    if (err) {
        console.log("Connection Error:", err);
    } else {
        console.log("Connection Success!");
    }
})


module.exports = client;