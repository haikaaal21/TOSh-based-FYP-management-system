const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(router);

const port = process.env.port || 4000;

const client = require('./connectDB');

// Route Imports
var statusRoute = require('./routes/status');
var studentSignupRoute = require('./routes/user/student/signup');
var academicStaffSignupRoute = require('./routes/user/staff/signup');
var loginRoute = require('./routes/user/login');


app.use('/status', statusRoute);
app.use('/user/student/signup', studentSignupRoute);
app.use('/user/staff/signup', academicStaffSignupRoute);
app.use('/user/login', loginRoute);

// 404 Route
app.use((req, res, next) => {
    res.status(404)
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
