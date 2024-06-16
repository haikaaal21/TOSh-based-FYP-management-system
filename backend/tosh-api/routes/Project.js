const express = require('express');
const router = express.Router();
const Project = require('../model/projectModel');
const Batch = require('../model/batchModel');
const fs = require('fs');

const project = new Project();
const batch = new Batch();
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

let folderCount = 0;
const uploadCreateFiles = createMulterInstance(`projects/`);

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

router.get('/getMine/:studentid', async (req,res) => {
	const studentid = req.params.studentid;
	const userid = req.query.userid;
	try {
		const result = await project.getMine(studentid, userid);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetching Projects:', error);
		res.status(500).json({message: 'Error in Fetching Projects!'});
	}
})


router.get('/get/:projectid/requests', async (req,res) => {
	const projectid = req.params.projectid;
	try {
		const result = await project.fetchRequests(projectid);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetching Requests:', error);
		res.status(500).json({message: 'Error in Fetching Requests!'});
	}
})

router.post('/verify', async (req,res) => {
	const accept = req.query.accept === 'true' ? true : false;
	const projectid = req.body.projectid;
	const studentid = req.body.studentid;
	try {
		await project.accordeclineRequest(projectid, studentid, accept);
		res.status(200).json({message: 'Request Accepted/Declined Successfully!'});
	} catch (error) {
		console.error('Error in Accepting/Declining Request:', error);
		res.status(500).json({message: 'Error in Accepting/Declining Request!'});
	}
});

router.get('/openclose/:projectid/:open', async (req,res) => {
	const projectid = req.params.projectid;
	const open = req.params.open;
	try {
		const result = await project.openCloseProject(projectid, open);
		res.status(200).json({message: 'Project Status Changed Successfully!'});
	} catch (error) {
		console.error('Error in Changing Project Status:', error);
		res.status(500).json({message: 'Error in Changing Project Status!'});
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

router.get(`/fetchall/:userid/:batchid/:offset`, async (req,res) => {
	const offset = req.params.offset;
	const limit = 6;
	const batchid = req.params.batchid;
	const userid = req.params.userid;
	const searchvalue = req.query.search || null;
	const filterValue = req.query.filter || null;
	try {
		const result = await project.fetchProjects(batchid, limit, offset, userid, searchvalue, filterValue);
		const tags = await project.fetchTags();
		res.status(200).json({
			projects: result,
			tagItems: tags
		});
	} catch (error) {
		console.error('Error in Fetch Project:', error);
		res.status(500).json({message: 'Error in Fetching Projects!'});
	}
});


router.post('/requestToPartake', async (req, res) => {
	const studentid = req.body.studentid;
	const projectid = req.body.projectid;
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

router.get('/fetchstaffs/:staffid', async (req,res) => {
	const staffid = req.params.staffid;
	try {
		const result = await project.fetchStaffProjects(staffid);
		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error in Fetching Staff Projects!'});
	}
})

router.get('/fetchBatch/:uniname', async (req,res) => {
	const uniName = req.params.uniname;
	try {
		const result = await batch.fetchBatchByUni(uniName);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetching Batch:', error);
		res.status(500).json({message: 'Error in Fetching Batch!'});
	}
})

router.get('/fetchDetailsForCreate/:uniname', async (req,res) => {
	const uniName = req.params.uniname;
	const uniNameAfterFilter = uniName.replace(/_/g, ' ');
	try {
		const result = await batch.fetchBatchByUni(uniNameAfterFilter, 1);
		const tags = await project.fetchTags();
		res.status(200).json({
			batches: result,
			tags: tags
		});
	} catch (error) {
		console.error('Error in Fetching Batch:', error);
		res.status(500).json({message: 'Error in Fetching Batch!'});
	}
})

router.post('/create', uploadCreateFiles.array('projectFiles'), async(req,res) => {
	let imagePath = req.files.filter(file => !file.path.endsWith('.md')).map(file => file.path.replace('public', ''));
	let markdownPath = req.files.filter(file => file.path.endsWith('.md')).map(file => file.path.replace('public', ''));
	imagePath.length === 0 ? imagePath = [null] : imagePath = imagePath;
	markdownPath.length === 0 ? markdownPath = [null] : markdownPath = markdownPath;
	const projectData = {
		projecttitle : req.body.projecttitle,
		projectdescription : req.body.projectdescription,
		projecttags : req.body.projecttype,
		projectbatch : req.body.projectbatch,
		projectstaff : req.body.projectStaff,
		projectimage : imagePath[0],
		intromarkdown : markdownPath[0],
	}

	try {
		const result = await project.createProject(projectData.projecttitle, projectData.projectdescription, projectData.projecttags, projectData.projectimage, projectData.projectstaff, projectData.projectbatch, projectData.intromarkdown);
		folderCount++;
		res.status(200).json({message: 'Project Created Successfully!'});
	} catch (error) {
		console.error('Error in Creating Project:', error);
		res.status(500).json({message: 'Error in Creating Project!'});
	}
})

router.post('/edit', uploadCreateFiles.array('projectFiles'), async(req,res) => {
	let imagePath = req.files.filter(file => !file.path.endsWith('.md')).map(file => file.path.replace('public', ''));
	let markdownPath = req.files.filter(file => file.path.endsWith('.md')).map(file => file.path.replace('public', ''));
	imagePath.length === 0 ? imagePath = [null] : imagePath = imagePath;
	markdownPath.length === 0 ? markdownPath = [null] : markdownPath = markdownPath;
	
	const projectData = {
		projectid : req.body.projectid,
		projecttitle : req.body.projecttitle,
		projectdescription : req.body.projectdescription,
		projecttags : req.body.projecttype,
		projectbatch : req.body.projectbatch,
		projectstaff : req.body.projectStaff,
		projectimage : imagePath[0],
		intromarkdown : markdownPath[0],
	}
	try {
		const projectOldFiles = await project.getProjectFiles(projectData.projectid);
		projectData.projectimage !== null && projectOldFiles[0].projectimage !== null ?
		fs.unlinkSync(`public${projectOldFiles[0].projectimage}`) : null;
		fs.unlinkSync(`public${projectOldFiles[0].intromarkdown}`);
		const result = await project.editProject(projectData.projectid, projectData.projecttitle, projectData.projectdescription, projectData.projecttags, projectData.projectimage, projectData.projectstaff, projectData.projectbatch, projectData.intromarkdown);
		res.status(200).json({message: 'Project Edited Successfully!'});
	} catch(error) {
		console.error('Error in Fetching Project Files:', error);
		res.status(500).json({message: 'Error in Fetching Project Files!'});
	}
});

router.post('/delete', async(req,res) => {
	const projectid = req.body.projectid;
	try {
		const projectOldFiles = await project.getProjectFiles(projectid);
		project.deleteProject(projectid);
		res.status(200).json({message: 'Project Deleted Successfully!'});
	} catch (error) {
		console.error('Error in Deleting Project:', error);
		res.status(500).json({message: 'Error in Deleting Project!'});
	}
	});

	router.get('/restore/:projectid', async(req,res) => {
		const projectid = req.params.projectid;
		try {
			const result = await project.restoreProject(projectid);
			res.status(200).json({message: 'Project Restored Successfully!'});
		} catch (error) {
			console.error('Error in Restoring Project:', error);
			res.status(500).json({message: 'Error in Restoring Project!'});
		}
	})

	router.get('/truncate/:projectid', async(req,res) => {
		const pid = req.params.projectid;
		try {
			const projectOldFiles = await project.truncateProject(pid);
			projectOldFiles.projectimage !== null ? fs.unlinkSync(`public${projectOldFiles.projectimage}`) : null;
			projectOldFiles.intromarkdown !== null ? fs.unlinkSync(`public${projectOldFiles.intromarkdown}`) : null;
			res.status(200).json({message: 'Project Truncated Successfully!'});
		} catch (error) {
			console.error('Error in Truncating Project:', error);
			res.status(500).json({message: 'Error in Truncating Project!'});
		}
	})

router.get('/fetch/unapproved/:batchid', async (req,res) => {
	const batchid = req.params.batchid;
	try {
		const result = await project.fetchUnapproved(batchid);
		res.status(200).json(result);
	} catch (error) {
		console.error('Error in Fetching Unapproved Projects:', error);
		res.status(500).json({message: 'Error in Fetching Unapproved Projects!'});
	}
})

router.get('/approve/:projectid', async (req,res) => {
	const projectid = req.params.projectid;
	try {
		const result = await project.approveProject(projectid);
		res.status(200).json({message: 'Project Approved Successfully!'});
	} catch (error) {
		console.error('Error in Approving Project:', error);
		res.status(500).json({message: 'Error in Approving Project!'});
	}
});

router.get('/disapprove/:projectid', async (req,res) => {
	const projectid = req.params.projectid;
	try {
		const result = await project.declineProject(projectid);
		res.status(200).json({message: 'Project Declined Successfully!'});
	} catch (error) {
		console.error('Error in Declining Project:', error);
		res.status(500).json({message: 'Error in Declining Project!'});
	}
})

module.exports = router;