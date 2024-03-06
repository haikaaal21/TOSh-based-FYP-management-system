const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'spares',
    user: 'kale',
    password: '12345'
})

client.connect((err) => {
    if (err) {
        console.log("Connection Error:", err);
    } else {
        console.log("Connection Success!");
    }
})


module.exports = client;