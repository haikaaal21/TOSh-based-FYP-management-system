const { Pool } = require('pg');
const config = require('config');

// const dbConfig = config.get('production');
// const dbConfig = config.get('development');
const dbConfig = config.get('release');


const client = new Pool(dbConfig);

client.on('connect',() => {
    console.log('Connected to Database!');
})

client.on('error', (err) => {
    console.error('Error in Database Connection:', err);
});


module.exports = client;