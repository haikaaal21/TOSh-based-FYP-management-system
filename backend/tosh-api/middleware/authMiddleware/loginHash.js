const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware to hash the password and generate salt

router.use(async (req, res, next) => {
    const password = req.body.password;
    const salt = req.body.salt;
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        next();
    } catch(error) {
        res.status(500).json({
            message: "An error occurred while hashing the password.",
            error: error.message,
        });
    }
});


module.exports = router;