const express = require('express');
const router = express.Router();
const UserModel = require('../../model/user');

router.post('/', async (req, res) => {
    const userModel = new UserModel();
    const emailToBeChecked = req.body.email;
    console.log('req', req);
    try {
        if (!emailToBeChecked) {
            res.status(400).json({
                status: 400,
                message: "Email is required"
            });
            return;
        }
        const result = await userModel.searchUser(emailToBeChecked, 'email');
        result.length === 0
        ? res.status(200).json({
            status: 200,
            unique: true
        }) : res.status(409).json({
            status: 409,
            unique: false,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

module.exports = router;