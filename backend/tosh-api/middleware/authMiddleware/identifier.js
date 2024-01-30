const express = require('express');
const router = express.Router();
const loginHash = require('../../middleware/authMiddleware/loginHash.js');
const client = require('../../connectDB.js');

router.use((req,res,next) => {
    var user_id = req.body.user_id;
    let table = ['spares_user', 'spares_academic_staff'];
    for(let i=0; i<table.length; i++){
        let sqlquery = `select * from ${table[i]} where user_id = ${user_id}`;
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