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

// router.use(async (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const sqlQuery = `SELECT * FROM "User" WHERE email = '${email}'`;
//     try {
//         const result = await client.query(sqlQuery);
//         if(result.rows.length !== 0) {
//             const salt = result.rows[0].salt;
//             const hashedPassword = await bcrypt.hash(password, salt);
//             if(hashedPassword === result.rows[0].password) {
//                 req.body.userID = result.rows[0].userid;
//                 next();
//             } else {
//                 res.status(401).json({
//                     message: "Incorrect Password",
//                 });
//             }
//         } else {
//             res.status(401).json({
//                 message: "User not found",
//             });
//         }
//     } catch(error) {
//         res.status(500).json({
//             message: "An error occurred while hashing the password.",
//             error: error.message,
//         });
//     }
// });

module.exports = router;