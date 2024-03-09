require('dotenv').config();

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


router.post('/', async (req, res) => {
    try {
        const query = `SELECT * FROM "User" WHERE email = '${req.body.email}'`;
        console.log(query);
        const result = await client.query(query);
        const userResult = result;
        console.log(userResult.rows[0]);
        const user = { userid: userResult.rows[0].userID, 
            email: userResult.rows[0].email, 
            password: userResult.rows[0].password,
            isStudent: userResult.rows[0].isstudent };
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN);
        const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);
        const role = userResult.rows[0].isstudent? "10601" : "10602";
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, role: [role]});
    } catch (error) {
        console.error('Error in Fetching User Details:', error);
        res.status(500).json({ message: 'Error in Fetching User Details!' });
    }
})

module.exports = router;