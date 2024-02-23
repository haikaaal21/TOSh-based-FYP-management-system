require ('dotenv').config();

const express = require('express');
const router = express.Router();
const loginHash = require('../../middleware/authMiddleware/loginHash.js');
const identifier = require('../../middleware/authMiddleware/identifier.js');
const client = require('../../connectDB.js');
const jwt = require('jsonwebtoken');

//Hasher Middlerware
router.use(loginHash);

//Identifer Middleware
router.use(identifier);

router.post('/', async (req,res) => {
    try {
        const result = await client.query(`SELECT * FROM spares_user WHERE user_id = ${req.body.user_id}`);
        const userResult = result;
        const user = {user_id:userResult.rows[0].user_id ,email: userResult.rows[0].email, password: userResult.rows[0].password};
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN);
        res.status(200).json({accessToken: accessToken, is_student: userResult.rows[0].is_student});
    } catch (error) {
        console.error('Error in Fetching User Details:', error);
        res.status(500).json({message: 'Error in Fetching User Details!'});
    }
})

module.exports = router;