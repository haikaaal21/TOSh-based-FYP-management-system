const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const port = process.env.port || 4000;

var notFound = require('./routes/404');
var taskRoute = require('./routes/Task');
var eventRoute = require('./routes/Event');
var projectRoute = require('./routes/Project');
var itemsRoute = require('./routes/items');
var UserRoute = require('./routes/User');
var fetchUnis = require('./routes/university/fetchUniversities');
var ComplaintRoute = require('./routes/Complaint');

app.use('/university/fetch', fetchUnis);
app.use('/task', taskRoute); 
app.use('/event', eventRoute);
app.use('/project', projectRoute);
app.use('/items', itemsRoute);
app.use('/user', UserRoute);
app.use('/complaint', ComplaintRoute);
app.use(express.static('./public'));

app.use('*', notFound);


app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
