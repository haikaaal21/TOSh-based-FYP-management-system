require('dotenv').config();

const express = require('express');
const router = express.Router();
const loginHash = require('../middleware/authMiddleware/loginHash.js');
const identifier = require('../middleware/authMiddleware/identifier.js');
const UserModel = require('../model/userModel.js');
const jwt = require('jsonwebtoken');
const StudentModel = require('../model/studentModel');
const academicStaffModel = require('../model/staffModel');
const inputValidator = require('../middleware/userMiddleware/inputValidation');
const passwordHash = require('../middleware/userMiddleware/passwordHash');
const Project = require('../model/projectModel.js');
const BatchModel = require('../model/batchModel.js');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware.js');
const TaskModel = require('../model/taskModel.js')
const EventModel = require('../model/eventModel.js');

const batchModel = new BatchModel();
const userModel = new UserModel();
const Task = new TaskModel();
const Event = new EventModel();
const projectModel = new Project();

const { sendMail } = require('../middleware/SendMail.js');



const uploadPFP = createMulterInstance('profile-pictures/');

router.post('/login', identifier, loginHash, async (req, res) => {
    try {
        const result = await userModel.searchUser(req.body.email, 'email');
        const user = result[0];
        if (user.password === req.body.password) {
            if(!user.verified) {
                throw new Error('User not verified!');
            }
            const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '4h' });
            const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '5d' });
            const role = req.body.user_type === 'Student' 
            ? "10601" 
            : "10602";
            let userItem = {};
            if(role === '10601') {
                const studentItem = await new StudentModel().fetchSpecifiedStudent(user.userid);
                userItem = {
                    id: studentItem.userid,
                    firstName : studentItem.name.split(' ')[0],
                    lastName : studentItem.name.split(' ')[1],
                    email: studentItem.email,
                    institution: studentItem.institution,
                    matricNumber: studentItem.matricnumber,
                    dob: studentItem.dob,
                    profilePicture: studentItem.profilepic,
                    specialid: studentItem.studentid,
                    pastduetasks: studentItem.pastduetasks,
                    closelyupcomingtasks: studentItem.redtasks + studentItem.yellowtasks,
                    batchid: studentItem.batchid,
                    batchname: studentItem.batchname,
                    projectid: studentItem.projectid,
                    requeststatus: studentItem.requeststatus,
                    role: 'Student',
                }
            } else if(role === '10602') {
                const staffItem = await new academicStaffModel().fetchSpecifiedAcademicStaff(user.userid);
                userItem = {
                    id: staffItem.userid,
                    firstName : staffItem.name.split(' ')[0],
                    lastName : staffItem.name.split(' ')[1],
                    email: staffItem.email,
                    institution: staffItem.institution,
                    matricNumber: staffItem.matricnumber,
                    dob: staffItem.dob,
                    profilePicture: staffItem.profilepic,
                    specialid: staffItem.staffid,
                    pastduetasks: staffItem.pastduetasks,
                    closelyupcomingtasks: staffItem.redtasks + staffItem.yellowtasks,
                    role: `Staff - ${staffItem.iscoordinator? 'Coordinator': 'Supervisor'}`,
                }
            }
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, role: [role], message: 'Login Successful', user: userItem});
        } else {
            throw new Error('Incorrect Password');
        }
    } catch(error) {
        console.error(error);
        error.message === 'User not found!'
        ? res.status(403).json({ message: 'Account does not exists!' })
        : error.message === 'Incorrect Password' ? res.status(403).json({ message: 'Incorrect Password!' }) : error.message === 'User not verified!' ? res.status(403).json({ message: 'User not verified!' }) : res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/forgotPass', async(req,res) => {
    const email = req.body.email;
    const pass  = req.body.newpass;
    try {
        const checkPass = await userModel.forgotPass(email, pass);
        if(checkPass !== false) {
            res.status(200).json({message: 'Password Updated Successfully!'});
            sendMail(
                email,
                "Password Updated",
                "verify.png",
                'there',
                `
                Your password has been updated successfully. Click the link below to verify your account.
                If you did not request this change, please contact us immediately.
                `,
                true,
                `${process.env.FRONTEND_URL}/verify?uid=${checkPass.userid}&key=${checkPass.verificationkey}`
            )
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }

})


router.post('/signup/student', inputValidator, passwordHash, async (req, res) => {
    try {
        const { email, name, password, salt, dob, matricNumber, institution } = req.body;
        const studentModel = new StudentModel();
        
        const newStudent = await studentModel.createStudent(email, name, password, salt, dob, matricNumber, institution);

        const mailOptions = {
            to: email,
            subject: "Activate your SPARES Account",
            image: 'verify.png',
            name: name,
            body: `
            Welcome to SPARES - Shame-Prompted Action for Responsible Evaluation and Submission We're thrilled to have you on board. To confirm your spot, please click the button below. We're excited to support your journey and help you achieve your goals. Click below to verify and let's get started!
            `,
            showButton: true,
            verificationLink: `${process.env.FRONTEND_URL}/verify?uid=${newStudent.userid}&key=${newStudent.verificationkey}`
        }
        sendMail(mailOptions.to, mailOptions.subject, mailOptions.image, mailOptions.name, mailOptions.body, mailOptions.showButton, mailOptions.verificationLink);
        res.status(201).json({
            status: 201,
            message: "Account created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

router.get('/verify/:uid/:key', async (req,res) => {
    const uid = req.params.uid;
    const key = req.params.key;
    try {
        const status = await userModel.verify(uid, key);
        status ? 
            res.status(200).json({message: "Account Verified Successfully!", verified: true})
            :  res.status(200).json({message: "Account Verification Failed!", verified: false});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}) 

router.post('/signup/staff', inputValidator, passwordHash, async (req, res) => {
    try {
        const {
            email, 
            name, 
            password, 
            salt, 
            dob, 
            matricNumber, 
            institution, 
            typeOfStaff} = req.body;
            typeOfStaff === 'Coordinator' ? isCoordinator = true : isCoordinator = false;
        const staffModel = new academicStaffModel();
        const balancer = isCoordinator? true: false;
        const result = await staffModel.createAcademicStaff(
            email, 
            name, 
            password, 
            salt, 
            dob, 
            matricNumber, 
            institution, 
            balancer
        );
        const mailOptions = {
            to: email,
            subject: "Activate your SPARES Account",
            image: 'verify.png',
            name: name,
            body: `
            Welcome to SPARES - Shame-Prompted Action for Responsible Evaluation and Submission We're thrilled to have you on board. To confirm your spot, please click the button below. We're excited to support your journey and help you achieve your goals. Click below to verify and let's get started!
            `,
            showButton: true,
            verificationLink: `${process.env.FRONTEND_URL}/verify?uid=${newStudent.userid}&key=${result.verificationkey}`
        }
        sendMail(mailOptions.to, mailOptions.subject, mailOptions.image, mailOptions.name, mailOptions.body, mailOptions.showButton, mailOptions.verificationLink);
        res.status(201).json({
            status: 201,
            data: result,
            message: "Staff created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

router.post('/signup/checkemail', async (req, res) => {
    const emailToBeChecked = req.body.email;
    try {
        if (!emailToBeChecked) {
            res.status(400).json({
                status: 400,
                message: "Email is required"
            });
            return;
        }
        const result = await userModel.searchUser(emailToBeChecked, 'email');
        result.length === 0
        ? res.status(200).json({
            status: 200,
            unique: true
        }) : res.status(409).json({
            status: 409,
            unique: false,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

router.get('/fetchprofile/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let project = {};
        const user = await userModel.searchUser(id, 'userid');
        if(user[0].isstudent) {
            const studentModel = new StudentModel();
            const student = await studentModel.fetchSpecifiedStudent(id);
            project = await projectModel.fetchMyProject(student.studentid);
        }
        res.status(200).json({
            status: 200,
            user: user,
            project: project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

router.post('/updateprofile', uploadPFP.single('file'), async(req, res) => {
    const { id, name, dob, institution, matricNumber, email } = req.body;
    const profilepic = req.file.path.replace('public', '');
    try {
        const user = await userModel.updateUser(id, name, dob, institution, matricNumber, email, profilepic);
        res.status(200).json({
            status: 200,
            message: "Profile Updated Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

router.get('/fetch/:batchid', async (req,res) => {
    const uni = req.query.uni ? req.query.uni.replace(/_/g, ' ') : null;
    const staffid = req.query.staffid;
    const batchid = req.params.batchid;
    try {
        let users;
        if(uni) {
            users = await userModel.fetchByUni(uni, batchid);
        } else if (staffid) {
            users = await userModel.fetchByProject(staffid, batchid);
        }
        res.status(200).json({
            status: 200,
            data: users
        });
    } catch(error) {
        console.error(error); res.status(500).json({status: 500, message: "Internal Server Error"});
    }
})

router.get('/fetchByUni/:uni', async (req,res) => {
    const uni = req.params.uni.replace(/_/g, ' ');
    const studentModel = new StudentModel();
    const staffModel = new academicStaffModel();
    try {
        const students = await studentModel.fetchStudentByUni(uni);
        const staff = await staffModel.fetchSupervisorByUni(uni);
        res.status(200).json({
            status: 200,
            students: students,
            staff: staff
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

router.post('/edit/profile/:id', async (req,res) => {
    const passwordEdited = req.query.passwordEdited;
    const id = req.params.id;
})

router.get('/staff/coordinator/fetchItems/:staffid', async (req,res) => {
    const staffid = req.params.staffid;
    const uniName = req.query.uni.replace(/_/g, ' ');
    try {
        const tasks = await Task.fetchTaskFromCreator(staffid);
        const events = await Event.fetchFromUni(uniName);
        const batchs = await batchModel.fetchBatchByUni(uniName);
        res.status(200).json({
            status: 200,
            tasks: tasks,
            events: events,
            batchs: batchs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

router.get('/staff/supervisor/fetchItems/:staffid/:userid', async (req,res) => {
    const staffid = req.params.staffid;
    const userid = req.params.userid;
    try {
        const tasks = await Task.fetchTaskByUserId(userid, 100, 0);
        const events = await Event.fetchEvents(userid, 100, 0);
        const projects = await projectModel.fetchStaffProjects(staffid);
        const filterOnlyProjects = projects.projects.filter((project) => project.approvalstatus);
        res.status(200).json({
            status: 200,
            tasks: tasks,
            events: events,
            projects: filterOnlyProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

router.post('/editprofile/:userid', uploadPFP.single('image') ,async (req,res) => {
    const id = req.params.userid;
    const crucial = req.query.crucial === 'true' ? true : false;
    const image = req.file ? req.file.path.replace('public', '') : null;
    let userInstance;
    if(!crucial) {
        userInstance = {
            name: req.body.name,
            dob: req.body.dob,
            institution: req.body.institution,
            profilepic: image
        }
    } else {
        userInstance = {
            name: req.body.name,
            dob: req.body.dob,
            institution: req.body.institution,
            profilepic: image,
            email: req.body.email,
            password: req.body.password
        }
    }
    try {
        const result = await userModel.editBasic(userInstance, id);
        if(crucial) {
            const additional = await userModel.editSuper(userInstance, id);
            sendMail(
                userInstance.email,
                "Verify Profile Update",
                "verify.png",
                userInstance.name,
                `
                Your profile has been updated successfully. Please verify your account by clicking the link below.
                `, true,
                `${process.env.FRONTEND_URL}/verify?uid=${id}&key=${additional}`
            )
        }
        res.status(200).json({message: 'Profile Edited Successfully!'});
    } catch(error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

module.exports = router;
