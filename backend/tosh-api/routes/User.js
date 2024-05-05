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



router.post('/login', identifier, loginHash, async (req, res) => {
    try {
        const userModel = new UserModel();
        const result = await userModel.searchUser(req.body.email, 'email');
        const user = result[0];
        if (user.password === req.body.password) {
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
                    batchid: studentItem.batchid
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
                }
            }
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, role: [role], message: 'Login Successful', user: userItem});
        } else {
            throw new Error('Incorrect Password');
        }
    } catch(error) {
        error.message === 'User not found!'
        ? res.status(403).json({ message: 'User was not found!' })
        : res.status(500).json({ message: 'Error in Logging in!' });
    }
});

router.post('/signup/student', inputValidator, passwordHash, async (req, res) => {
    console.log(req.body);
    try {
        const { email, name, password, salt, dob, matricNumber, institution } = req.body;
        const studentModel = new StudentModel();
        
        const newStudent = await studentModel.createStudent(email, name, password, salt, dob, matricNumber, institution);

        res.status(201).json({
            status: 201,
            data: newStudent,
            message: "Student created successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

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
            console.log(req.body);
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
    const userModel = new UserModel();
    const emailToBeChecked = req.body.email;
    console.log('req', req);
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
        const userModel = new UserModel();
        const user = await userModel.searchUser(id, 'userid');
        if(user[0].isstudent) {
            console.log('student')
            const studentModel = new StudentModel();
            const student = await studentModel.fetchSpecifiedStudent(id);
            const projectModel = new Project();
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

module.exports = router;
