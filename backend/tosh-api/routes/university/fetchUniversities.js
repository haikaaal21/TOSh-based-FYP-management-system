const express = require('express');
const router = express.Router();
const UniversityModel = require('../../model/universityModel');

router.get('/', async(req,res) => {
    try {
        const universityModel = new UniversityModel();
        const universities = await universityModel.fetchAllUniversities();
        res.status(200).json({
            status: 200,
            data: universities,
            message: "Universities fetched successfully"
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