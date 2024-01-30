const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware to hash the password and generate salt
router.use(async (req, res, next) => {
    const password  = req.body.password;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        req.body.salt = salt;
        next();
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while hashing the password.",
            error: error.message,
        });
    }

});

// Export the router
module.exports = router;

