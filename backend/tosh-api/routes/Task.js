const express = require('express');
const router = express.Router();
const Task = require('../model/taskModel');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

const uploadSubmission = createMulterInstance('submissions/')

//? Fetch Details of a Task
//* WORKING!

const task = new Task();

router.get(`/:taskid` , async (req,res) => {
    const taskid = req.params.taskid;
    try {
        const result = await task.fetchTaskDetails(taskid);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Task Details:', error);
        res.status(500).json({message: 'Error in Fetching Task Details!'});
    }
});

//? Fetch all Tasks by User ID
//* WORKING!
router.get('/:userid/:offset', async (req, res) => {
    const offset = req.params.offset;
    const userid = req.params.userid;
    const limit = 10;
    try {
        const result = await task.fetchTaskByUserId(userid, limit, offset);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Task:', error);
        res.status(500).json({message: 'Error in Fetching Task!'});
    }
});

router.post ('/submit/:multerid/:userid', uploadSubmission.array('file'), async (req,res) => {
    const taskid = req.params.multerid;
    const userid = req.params.userid;
    const filedirectories = req.files.map(file => file.path.replace('public', ''));
    for(let i = 0; i < filedirectories.length; i++) {
        const typeoffile = req.files[i].mimetype;
        try{
            await task.submitTask(taskid, filedirectories[i], userid, typeoffile);
        } catch (error) {
            console.error('Error in Submitting Task:', error);
            res.status(500).json({message: 'Error in Submitting Task!'});
        }
    }
    try{
        task.submittedTask(taskid, userid);    
    } catch(error) {
        console.error('Error in Submitting Task:', error);
        res.status(500).json({message: 'Error in Submitting Task!'});
    }
    res.status(200).json({message: 'Task Submitted Successfully!'});
})

router.post('/create', async(req,res) => {

})


module.exports = router;