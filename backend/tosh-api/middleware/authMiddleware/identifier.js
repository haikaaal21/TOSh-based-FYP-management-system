const express = require('express');
const router = express.Router();
const UserModel = require('../../model/user');

router.use( async (req,res,next) => {
    var email = req.body.email;
    var userModel = new UserModel();
    try {
    var result = await userModel.searchUser(email, 'email');
    if(result.length === 0) 
        throw new Error('User not found!');
    else {
        let identify = result[0].isStudent ? 'Student' : 'AcademicStaff';
        req.body.user_type = identify;
        req.body.userid = result[0].userid;
        req.body.salt = result[0].salt;
        next();
    }   
    } catch(error) {
        console.log(error);
        error.message === 'User not found!' 
        ? res.status(403).json({message: 'User was not found!'}) 
        : res.status(500).json({ message: 'Internal Server Error!' });
    }
})

module.exports = router;