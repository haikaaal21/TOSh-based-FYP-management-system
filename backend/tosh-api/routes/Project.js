const express = require('express');
const router = express.Router();
const Project = require('../model/projectModel');

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
router.get(`/getProject/:projectid/:studentid`, async (req,res) => {
    const projectid = req.params.projectid;
	const studentid = req.params.studentid;
    try {
        const result = await project.fetchProjectDetails(projectid);
		const check = await project.checkProjectStudent(projectid, studentid);
		const data = {
			project: result,
			check: check
		}
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in Fetching Project Details:', error);
        res.status(500).json({message: 'Error in Fetching Project Details!'});
    }
})

//? Fetch Projects
//* WORKING!
router.get(`/fetchall/:userid/:batchid/:offset`, async (req,res) => {
	const offset = req.params.offset;
	const limit = 6;
	const batchid = req.params.batchid;
	const userid = req.params.userid;
	try {
		const result = await project.fetchProjects(batchid, limit, offset, userid);
		console.log('result:', result)
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetch Project:', error);
		res.status(500).json({message: 'Error in Fetching Projects!'});
	}
});
module.exports = router;