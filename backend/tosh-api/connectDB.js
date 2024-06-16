const { Pool } = require('pg');
const config = require('config');

// const dbConfig = config.get('test');
const dbConfig = config.get('development');


const client = new Pool(dbConfig);

client.on('connect',() => {
    console.log('Connected to Database!');
})

client.on('error', (err) => {
    console.error('Error in Database Connection:', err);
});


module.exports = client;