const express = require('express');
const router = express.Router();
const batchModel = require('../model/batchModel');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

const uploadImage = createMulterInstance('batch-documentation/');
const BatchModel = new batchModel();



router.get('/fetch/:institution', async (req,res) => {
    const institution = req.params.institution.replace(/_/g, ' ');
    const batchstatus = parseInt(req.query.batchstatus);
    try {
        let result;
        if(batchstatus !== undefined) {
            result = await BatchModel.fetchBatchByUni(institution, batchstatus);
        } else {
            result = await BatchModel.fetchBatchByUni(institution);
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Batch:', error);
        res.status(500).json({message: 'Error in Fetching Batch!'});
    }
})

router.post('/create', async(req, res) => {
    const batchname = req.body.batchname;
    const batchhead = req.body.batchhead;
    const batchyear = req.body.batchyear;
    const students = req.body.students;
    const staff = req.body.staff;
    try {
        const batch = await BatchModel.createBatch(batchname, batchhead, batchyear);
        const studentQuery = await BatchModel.updateStudentBatches(students, batch.batchid);
        const staffQuery = await BatchModel.createBatchSupervisor(batch.batchid, staff);
        res.status(200).json({
            status: 200,
            message: 'Batch Created Successfully'
        });
    } catch (error) {
        console.error('Error in Creating Batch:', error);
        res.status(500).json({message: 'Error in Creating Batch!'});
    }
})

//!! TODO
router.get('/fetchDetails/:batchid',async (req,res) => {
    const batchid = req.params.batchid;
    try {
        const batch = await BatchModel.fetchSpecifiedBatch(batchid);
        res.status(200).json(batch);
    } catch (error) {
        console.error('Error in Fetching Batch Details:', error);
        res.status(500).json({message: 'Error in Fetching Batch Details!'});
    }
})

router.post('/edit/:batchid', async(req,res) => {
    const batchid = req.params.batchid;
    const batchname = req.body.batchname;
    const batchyear = req.body.batchyear;
    const batchstatus = req.body.batchstatus;
    try {
        const result = await BatchModel.updateBatch(batchid, batchname, batchyear, batchstatus);
        res.status(200).json({message: 'Batch Edited Successfully!'});
    } catch (error) {
        console.error('Error in Editing Batch:', error);
        res.status(500).json({message: 'Error in Editing Batch!'});
    }
})

router.post('/documentation/upload/:batchid/:multerid', uploadImage.single('image'), async (req,res) => {
    const batchid = req.params.batchid;
    const image = req.file.path.replace('public', '');
    const docinstance = {
        batchid: batchid,
        documentationtitle: req.body.documentationtitle,
        batchdocumentation: image,
    }
    
    try {
        const result = await BatchModel.uploadDocumentation(docinstance);
        res.status(200).json({message: 'Documentation Uploaded Successfully!'});
    } catch (error) {
        console.error('Error in Uploading Documentation:', error);
        res.status(500).json({message: 'Error in Uploading Documentation!'});
    }
}) 


module.exports = router;