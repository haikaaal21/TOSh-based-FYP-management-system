const express = require('express');
const router = express.Router();
const Task = require('../model/task');

//? Fetch Details of a Task
//* WORKING!
router.get(`/:taskid` , async (req,res) => {
    const task = new Task();
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
router.get('/:userid/:offset', async (req, res) => {
    const offset = req.params.offset;
    const userid = req.params.userid;
    const limit = 10;
    const task = new Task();
    try {
        const result = await task.fetchTaskByUserId(userid, limit, offset);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Task:', error);
        res.status(500).json({message: 'Error in Fetching Task!'});
    }
});


module.exports = router;