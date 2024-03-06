const express = require('express');
const router = express.Router();
const loginHash = require('../../middleware/authMiddleware/loginHash.js');
const client = require('../../connectDB.js');

//! Fix this identifier Middleware
router.use((req,res,next) => {
    var userID = req.body.userID;
    let table = ['"User"', '"AcademicStaff"'];
    for(let i=0; i<table.length; i++){
        let sqlquery = `select * from ${table[i]} where userID = ${userID}`;
        console.log("SQL QUERY:", sqlquery);
        client.query(sqlquery);
        if(res.length === 0) {
            return;
        } else {
            req.body.user_type = table[i];
            next();
        }
    }
})

module.exports = router;