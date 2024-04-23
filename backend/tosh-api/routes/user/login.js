require('dotenv').config();

const express = require('express');
const router = express.Router();
const loginHash = require('../../middleware/authMiddleware/loginHash.js');
const identifier = require('../../middleware/authMiddleware/identifier.js');
const UserModel = require('../../model/userModel.js');
const jwt = require('jsonwebtoken');

//Identifer Middleware
router.use(identifier);

//Hasher Middlerware
router.use(loginHash);

router.post('/', async (req, res) => {
    try {
        const userModel = new UserModel();
        const result = await userModel.searchUser(req.body.email, 'email');
        const user = result[0];
        if (user.password === req.body.password) {
            const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '4h' });
            const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '5d' });
            const role = req.body.user_type === 'Student' 
            ? "10601" 
            : "10602";
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, role: [role] });
        } else {
            throw new Error('Incorrect Password');
        }
    } catch(error) {
        error.message === 'User not found!'
        ? res.status(403).json({ message: 'User was not found!' })
        : res.status(500).json({ message: 'Error in Logging in!' });
    }
});

module.exports = router;