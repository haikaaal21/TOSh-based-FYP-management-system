const express = require('express');
const router = express.Router();
const StudentModel = require('../../../model/student');

router.get('/', async (req, res) => {
    try {
        const studentModel = new StudentModel();
        const students = await studentModel.fetchAllStudents();
        res.status(200).json({
            status: 200,
            data: students,
            message: "Students fetched successfully"
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
