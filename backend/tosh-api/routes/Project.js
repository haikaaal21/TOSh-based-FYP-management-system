const express = require('express');
const router = express.Router();
const Project = require('../model/project');

// CONTOH : http://localhost:4000/project/7

const project = new Project();


// ? Fetch the user's project
//* WORKING!
router.get(`/myProject/:studentid`, async (req,res) => {
	const studentid = req.params.studentid;
	try {
		const result = await project.fetchMyProject(studentid);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetching Your Project:', error);
		res.status(500).json({message:'Error in Fetching the users project!'});
	}
});

//? Fetch Details of a Project
//* WORKING!
router.get(`/getProject/:projectid`, async (req,res) => {
    const projectid = req.params.projectid;
    try {
        const result = await project.fetchProjectDetails(projectid);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Project Details:', error);
        res.status(500).json({message: 'Error in Fetching Project Details!'});
    }
})

//? Fetch Projects

router.get(`/fetchall/:batchid/:offset`, async (req,res) => {
	const offset = req.params.offset;
	const limit = 10;
	const batchid = req.params.batchid;
	try {
		const result = await project.fetchProjects(batchid, limit, offset);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetch Project:', error);
		res.status(500).json({message: 'Error in Fetching Projects!'});
	}
});
module.exports = router;