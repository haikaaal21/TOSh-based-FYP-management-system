const express = require('express');
const router = express.Router();

const client = require('../connectDB');


router.get('/', async (req,res) =>{
    try {
        const result = await client.query("SELECT * FROM spares_user");
        res.json(result.rows);
    } catch (error) {
        console.error('Error in Fetching Status:', error);
        res.status(500).json({message: 'Error in Fetching Status!'});
    }
});

module.exports = router;