const express = require('express');
const router = express.Router();
const Task = require('../model/taskModel');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

const uploadSubmission = createMulterInstance('submissions/')
const fs = require('fs');

//? Fetch Details of a Task
//* WORKING!

const task = new Task();

const multerUpload = createMulterInstance('task/');

router.get('/submission/get', async(req,res) => {
    const taskid = req.query.taskid;
    try {
        const result = await task.getSubmissions(taskid);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Submissions:', error);
        res.status(500).json({message: 'Error in Fetching Submissions!'});
    }
}) 

router.get('/delete/:taskid', async(req,res) => {
    const taskid = req.params.taskid;
    try {
        const deleteFiles = await task.deleteTask(taskid);
        for(let i=0; i<deleteFiles.length; i++) {
            fs.unlinkSync(`public${deleteFiles[i].taskfile}`);
        }
        res.status(200).json({message: 'Task Deleted Successfully!'});
    } catch (error) {
        console.error('Error in Deleting Task:', error);
        res.status(500).json({message: 'Error in Deleting Task!'});
    }
})

const {sendMail} = require('../middleware/SendMail');

router.get('/pressure/:taskid', async(req,res) => {
    const taskid = req.params.taskid;
    try {
        const result = await task.fetchRecipients(taskid);
        const mailObj = {
            to : result.users.map(user => user.email),
            subject : `Reminder to submit ${result.task.tasktitle}`,
            image: 'remind.png',
            name: 'you!',
            body: `
                You didn't forget to submit ${result.task.tasktitle} right?
                Well, the deadline is ${result.task.duedate.toLocaleDateString()} and you haven't submitted yet!
                Submit the task ASAP! Don't keep your lecturer waiting, it would be a shame if you do so. In any case, godspeed.
            `
        }
        sendMail(mailObj.to, mailObj.subject, mailObj.image, mailObj.name, mailObj.body);
        res.status(200).json({message: 'Users Pressured Successfully!'});
    } catch (error) {
        console.error('Error in Pressuring Task:', error);
        res.status(500).json({message: 'Error in Pressuring Task!'});
    }
})

router.post('/edit/:taskid', async(req,res) => {
    const taskid = req.params.taskid;
    const taskInstance = {
        tasktitle : req.body.tasktitle,
        taskdescription: req.body.taskdescription,
        duedate: req.body.duedate,
        lock : req.body.lock,
    }
    try {
        const result = await task.editTask(taskid, taskInstance);
        res.status(200).json({message: 'Task Edited Successfully!'});
    } catch (error) {
        console.error('Error in Editing Task:', error);
        res.status(500).json({message: 'Error in Editing Task!'});
    }
})

router.get(`/:taskid` , async (req,res) => {
    const taskid = req.params.taskid;
    const userid = req.query.userid;
    try {
        const result = await task.fetchTaskDetails(taskid, userid);
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
    const limit = 100;
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
            const filename = req.files[i].originalname;
        try{
            await task.submitTask(taskid, filedirectories[i], userid, typeoffile, filename);
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

router.post('/create/:multerid', multerUpload.array('taskFiles'), async(req,res) => {
    const taskFiles = req.files;
    const taskInstance = {
        tasktitle : req.body.tasktitle,
        taskdescription: req.body.taskdescription,
        duedate: req.body.duedate,
        yellowzone: req.body.yellowzone,
        redzone: req.body.redzone,
        lock : req.body.lock,
        assignedfrom: req.body.assignedfrom,
        batchid: req.body.batchid,
        assignedto : req.body.assignedto
    }
    try {
        const result = await task.createTask(taskFiles, taskInstance);
        const emails = result.map(user => user.email)
        const mailObj = {
            to : emails,
            subject : `New Task: ${taskInstance.tasktitle}`,
            image: 'newtask.png',
            name: 'you!',
            body: `
                A new task has been assigned to you! The task is titled ${taskInstance.tasktitle} and the deadline is ${taskInstance.duedate}.
                Make sure to submit the task before the deadline. Godspeed!
            `
        }
        sendMail(mailObj.to, mailObj.subject, mailObj.image, mailObj.name, mailObj.body);
        res.status(200).json({message: 'Task Created Successfully!'});
    } catch (error) { 
        console.error('Error in Creating Task:', error);
        res.status(500).send('Error in Creating Task! Status Code :' + error.status)
    }
})

router.get('/fetchStaffTasks/:userid/:specialid/:coordinator', async(req,res) => {
    const userid = req.params.userid;
    const coordinator = req.params.coordinator === 'true' ? true : false;
    const specialid = req.params.specialid;
    try {
        let tasks;
        if(!coordinator) {
            tasks = await task.fetchTaskByUserId(userid, 100, 0);
        }
        const createdTask = await task.fetchTaskFromCreator(specialid);
        if(!coordinator) {
            res.status(200).json({tasks: tasks, createdTask: createdTask});
        } else {
            res.status(200).json({createdTask: createdTask});
        }
    } catch(error) {
        console.error('Error in Fetching Staff Tasks:', error);
        res.status(500).json({message: 'Error in Fetching Staff Tasks!'});
    }
})

router.get('/rollback/:taskid/:userid', async(req,res) => {
    const taskid = req.params.taskid;
    const userid = req.params.userid;
    try {
        const result = await task.rollbackSubmission(taskid, userid);
        for(let i = 0; i < result.length; i++) {
            fs.unlinkSync(`public${result[i].tasksubmissionfile}`);
        }
        res.status(200).json({message: 'Submission Rolled Back Successfully!'});
    } catch (error) {
        console.error('Error in Rolling Back Submission:', error);
        res.status(500).json({message: 'Error in Rolling Back Submission!'});
    }
} )



module.exports = router;