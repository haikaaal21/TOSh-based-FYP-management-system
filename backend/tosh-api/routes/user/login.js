const express = require('express');
const router = express.Router();
const loginHash = require('../../middleware/authMiddleware/loginHash.js');
const identifier = require('../../middleware/authMiddleware/identifier.js');
const client = require('../../connectDB.js');

//Hasher Middlerware
router.use(loginHash);

//Identifer Middleware
router.use(identifier);


router.get('/', async (req,res) => {
    try {
        const result = await client.query(`SELECT * FROM ${req.body.user_type} WHERE user_id = ${req.body.user_id}`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error in Fetching User Details:', error);
        res.status(500).json({message: 'Error in Fetching User Details!'});
    }
})

module.exports = router;