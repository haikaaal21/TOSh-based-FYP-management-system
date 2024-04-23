const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const port = process.env.port || 4000;

var studentSignupRoute = require('./routes/user/student/signup');
var academicStaffSignupRoute = require('./routes/user/staff/signup');
var loginRoute = require('./routes/user/login');
var checkUniqueEmail = require('./routes/auth/checkEmailUnique');
var notFound = require('./routes/404');

var taskRoute = require('./routes/Task');
var eventRoute = require('./routes/Event');
var projectRoute = require('./routes/Project');

var fetchUnis = require('./routes/university/fetchUniversities');

app.use('/user/student/signup', studentSignupRoute);
app.use('/user/staff/signup', academicStaffSignupRoute);
app.use('/user/login', loginRoute);
app.use('/auth/checkUEmail', checkUniqueEmail);
app.use('/university/fetch', fetchUnis);

app.use('/task', taskRoute); 
app.use('/event', eventRoute);
app.use('/project', projectRoute);

app.use('*', notFound);


app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
