const express = require('express');
const router = express.Router();
const Complaint = require('../model/complaintModel');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

const complaint = new Complaint();
const uploadComplaint = createMulterInstance('complaint-files/');

router.post('/create/:multerid', uploadComplaint.array('file'), async (req,res) => {
    const studentid = req.params.multerid;
    req.body.complaintFiles = req.files;
    const complaintItem = {
        complainttitle: req.body.title,
        complaintdescription: req.body.description,
        complaintFiles: req.body.complaintFiles,
    }
    const dateCreated = new Date();
    let complaintID;
    try {
        complaintID = await complaint.createComplaint(studentid, complaintItem, dateCreated);
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
        }
    complaintItem.complaintFiles.map(async (file) => {
        try {
        await complaint.insertComplaintFiles(complaintID, file);
        } catch (error) {
            console.error(error);
            res.status(500).json({status: 500 ,message: 'Internal Server Error'});
        }
    })
    res.status(200).json({status:200, message: 'Complaint Created Successfully!'});
})

router.get('/fetchmine/:studentid', async(req, res) => {
    const studentid = req.params.studentid;
    try {
        const complaints = await complaint.fetchUserStudentComplaints(studentid);
        res.status(200).json({status:200, complaints: complaints});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
    }
})

router.get('/fetchdetails/:complaintid', async(req,res) => {
    const isstaff = req.query.isstaff? true : false;
    const complaintid = req.params.complaintid;
    try {
        const complaints = await complaint.fetchComplaint(complaintid, isstaff);
        res.status(200).json({status:200, complaints: complaints});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
    }
})

router.post('/:complaintid/reply/create/:userid', async(req,res) => {
    const complaintid = req.params.complaintid;
    const userid = req.params.userid;
    const reply = req.body.replytext;
    const fromstaff = req.body.fromstaff ? true : false;
    try{
        complaint.createReply(complaintid, userid, reply, fromstaff);
        res.status(200).json({status:200, message: 'Reply Created Successfully!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
    }
})

router.get('/fetch/:institution', async (req,res) => {
    const institution = req.params.institution.replace(/_/g, ' ');
    try {
        const result = await complaint.fetchAll(institution);
        res.status(200).json({status:200, complaints: result});
    } catch (error) {
        console.error('Error in Fetching Complaint:', error);
        res.status(500).json({message: 'Error in Fetching Complaint!'});
    }
})

router.get('/close/:complaintid', async(req,res) => {
    const complaintid = req.params.complaintid;
    try {
        const result = await complaint.closeComplaint(complaintid);
        res.status(200).json({status:200, message: 'Complaint Closed Successfully!'});
    } catch (error) {
        console.error('Error in Closing Complaint:', error);
        res.status(500).json({message: 'Error in Closing Complaint!'});
    }
})


module.exports = router;