const express = require('express');
const router = express.Router();

const academicStaffModel = require('../../../model/staff');
const inputValidator = require('../../../middleware/userMiddleware/inputValidation');
const passwordHash = require('../../../middleware/userMiddleware/passwordHash');

// Input validation middleware
router.use(inputValidator);

// Password hashing middleware
router.use(passwordHash);

router.post('/', async (req, res) => {
    try {
        const {
            email, 
            name, 
            password, 
            salt, 
            dob, 
            matricNumber, 
            institution, 
            isSupervisor, 
            isCoordinator} = req.body;
        const staffModel = new academicStaffModel();
        const balancer = isCoordinator? true: false;
        const result = await staffModel.createAcademicStaff(
            email, 
            name, 
            password, 
            salt, 
            dob, 
            matricNumber, 
            institution, 
            balancer
        );
        res.status(201).json({
            status: 201,
            message: "Staff created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});


module.exports = router;