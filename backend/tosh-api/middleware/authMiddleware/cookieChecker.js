const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.use(async (req, res, next) => {
    const accessToken = req.headers['authorization'];
    if(!accessToken) {
        res.status(401).json({
            message: "Access Token Required",
        });
    }
    jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if(err) {
            res.status(403).json({
                message: "Invalid Token",
            });
        } else {
            req.body.user = user;
            next();
        }
    });
});