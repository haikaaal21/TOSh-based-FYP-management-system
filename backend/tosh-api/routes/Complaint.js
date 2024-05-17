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
        console.log(complaints);
        res.status(200).json({status:200, complaints: complaints});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
    }
})

router.get('/fetchdetails/:complaintid', async(req,res) => {
    const complaintid = req.params.complaintid;
    try {
        const complaints = await complaint.fetchComplaint(complaintid);
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
    try{
        complaint.createReply(complaintid, userid, reply);
        res.status(200).json({status:200, message: 'Reply Created Successfully!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 500 ,message: 'Internal Server Error'});
    }
})

module.exports = router;