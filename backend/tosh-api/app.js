const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const port = process.env.port || 4000;

const client = require('./connectDB');

// Route Imports
var statusRoute = require('./routes/status');
var studentSignupRoute = require('./routes/user/student/signup');
var studentFetchRoute = require('./routes/user/student/fetch');
var academicStaffSignupRoute = require('./routes/user/staff/signup');
var loginRoute = require('./routes/user/login');
var checkUniqueEmail = require('./routes/auth/checkEmailUnique');
var notFound = require('./routes/404');
var fetchUnis = require('./routes/university/fetch');


app.use('/status', statusRoute);
app.use('/user/student/signup', studentSignupRoute);
app.use('/user/student/fetch', studentFetchRoute);
app.use('/user/staff/signup', academicStaffSignupRoute);
app.use('/user/login', loginRoute);
app.use('/auth/checkUEmail', checkUniqueEmail);
app.use('/university/fetch', fetchUnis);

app.use('*', notFound);


// 404 Route
app.use((req, res, next) => {
    res.status(404)
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
