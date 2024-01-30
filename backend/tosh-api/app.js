const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);

const port = process.env.port || 3000;

const client = require('./connectDb');

// Route Imports
var statusRoute = require('./routes/status');
var studentSignupRoute = require('./routes/user/student/signup');
var academicStaffSignupRoute = require('./routes/user/staff/signup');


app.use('/status', statusRoute);
app.use('/user/student/signup', studentSignupRoute);
app.use('/user/staff/signup', academicStaffSignupRoute);

// 404 Route
app.use((req, res, next) => {
    res.status(404)
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
