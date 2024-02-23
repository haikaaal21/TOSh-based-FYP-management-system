const express = require('express');
const router = express.Router();

const client = require('../../../connectDB');
const academicStaffModel = require('../../../model/staff');
const inputValidator = require('../../../middleware/userMiddleware/inputValidation');
const passwordHash = require('../../../middleware/userMiddleware/passwordHash');

// Input validation middleware
router.use(inputValidator);

// Password hashing middleware
router.use(passwordHash);

router.post('/', async (req, res) => {
    try {
        let newAcademicStaff = new academicStaffModel({});

        newAcademicStaff.createAcademicStaffConstructor(req.body.email, req.body.password, req.body.salt, req.body.dob, req.body.matric_number, req.body.institution, req.body.unsubmitted_tasks, req.body.profile_picture, req.body.is_coordinator, req.body.is_supervisor);

        sqlQuery = newAcademicStaff.createAcademicStaff();
        console.log(newAcademicStaff);
        console.log(sqlQuery);
        let queryResult = await client.query(sqlQuery);
        
        res.status(200).json({
            message: "OK",
            queryResult
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while creating the academicStaff.",
            error: error.message,
            body: req.body
        });
    }
});


module.exports = router;