const express = require('express');
const router = express.Router();
const StudentModel = require('../../../model/student');
const inputValidator = require('../../../middleware/userMiddleware/inputValidation');
const passwordHash = require('../../../middleware/userMiddleware/passwordHash');

// Input validation middleware
router.use(inputValidator);

// Password hashing middleware
router.use(passwordHash);

router.post('/', async (req, res) => {
    try {
        const { email, name, password, salt, dob, matricNumber, institution } = req.body;
        const studentModel = new StudentModel();
        const newStudent = await studentModel.createStudent(email, name, password, salt, dob, matricNumber, institution);

        res.status(201).json({
            status: 201,
            data: newStudent,
            message: "Student created successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});



module.exports = router;