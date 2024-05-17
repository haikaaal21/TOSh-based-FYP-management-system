const express = require('express');
const router = express.Router();
const Project = require('../model/projectModel');

const project = new Project();

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

router.get(`/fetchall/:userid/:batchid/:offset/:searchvalue?`, async (req,res) => {
	const offset = req.params.offset;
	const limit = 6;
	const batchid = req.params.batchid;
	const userid = req.params.userid;
	const searchvalue = req.params.searchvalue;
	try {
		const result = await project.fetchProjects(batchid, limit, offset, userid, searchvalue);
		console.log('result:', result)
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetch Project:', error);
		res.status(500).json({message: 'Error in Fetching Projects!'});
	}
});


router.post('/requestToPartake', async (req, res) => {
	const studentid = req.body.studentid;
	const projectid = req.body.projectid;
	const project = new Project();
	console.log(req.body);
	try {
		const result = await project.requestToPartakeinProject(projectid, studentid);
		const response = {
			message: 'Request created successfully!',
			result: result
		}
		res.status(200).json(response);
	} catch (error) {
		console.error('Error in Requesting to Partake in Project:', error);
		res.status(500).json({message: 'Error in Requesting to Partake in Project!'});
	}
});

module.exports = router;