const express = require('express');
const router = express.Router();

router.use((req,res,next) => {
    if(!req.body.unsubmitted_tasks){
        req.body.unsubmitted_tasks = 0;
    }
    if(!req.body.profile_picture){
        req.body.profile_picture = "./assets/images/placeholder.jpg";
    }
    if(!req.body.email){
        res.status(400).json({
            message: "Email is required.",
        });
    }
    if(!req.body.password){
        res.status(400).json({
            message: "Password is required."
        });
    }
    next();
});

module.exports = router;
