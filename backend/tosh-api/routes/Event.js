const express = require('express');
const router = express.Router();
const Event = require('../model/eventModel');
const createMulterInstance = require('../middleware/authMiddleware/storageMiddleware');

const uploadFiles = createMulterInstance('event/');

const event = new Event();


router.get('/attendance/:eventid/get',async(req,res) => {
    const eventid = req.params.eventid;
    try{
        const result = await event.getAttendance(eventid);
        res.status(200).json(result);
    } catch(error) {
        console.error('Error in Fetching Attendance:', error);
        res.status(500).json({message: 'Error in Fetching Attendance!'});
    }
})

router.post('/attendance/:eventid/update', async(req,res) => {
    const eventid = req.params.eventid;
    const updateitems = Array.isArray(req.body.modifications) ? req.body.modifications : [req.body.modifications];
    try {
        const resItem = await event.updateAttendance(eventid, updateitems)
        res.status(200).json({message:'Attendance Updated!'})
    } catch (error) {
        console.error('Error in Updating Attendance:', error);
        res.status(500).json({message: 'Error in Updating attendance!'})
    }
})

router.get('/fetchcoorevent/:uni', async(req,res) => {
    const uni = req.params.uni.replace(/_/g, ' ');
    const staffid = req.query.staffid;
    try {
        const result = await event.fetchFromUni(uni);
        const ownEvents = await event.fetchEventFromCreator(staffid)
        res.status(200).json({
            allEvents: result,
            ownEvents: ownEvents
        });
    } catch (error) {
        console.error('Error in Fetching Coor Events:', error);
        res.status(500).json({message: 'Error in Fetching Coor Events!'});
    }
})

router.post('/editEvent/:eventid', async(req,res) => {
    const eventid = req.params.eventid;
    const eventInstance = {
        eventtitle: req.body.eventtitle,
        eventdescription: req.body.eventdescription,
        eventdate: req.body.eventdate,
        eventtime: req.body.eventtime,
        gmapembed: req.body.gmapembed,
    }
    try {
        const result = await event.updateEvent(eventInstance, eventid);
        res.status(200).json({message: 'Event Edited Successfully!'});
    } catch (error) {
        console.error('Error in Editing Event:', error);
        res.status(500).json({message: 'Error in Editing Event!'});
    }
})

router.get('/fetchsuperevent/:specialid/:userid', async(req,res) => {
    const specialid = req.params.specialid;
    const userid = req.params.userid;
    try {
        const eventsAssignedTo = await event.fetchEvents(userid, 150, 0);
        const myEvents = await event.fetchEventFromCreator(specialid);
        res.status(200).json({
            allEvents: eventsAssignedTo,
            ownEvents: myEvents
        });
    } catch (error) {
        console.error('Error in Fetching Super Events:', error);
        res.status(500).json({message: 'Error in Fetching Super Events!'});
    }
})


router.get(`/:userid/:offset`,async (req,res) => {
    const offset = req.params.offset;
    const limit = 10;
    const userid = req.params.userid;
    try {
        const result = await event.fetchEvents(userid, limit, offset);
        res.status(200).json(result);
    } catch(error) {
        console.error('Error in Fetch Event:',error);
        res.status(500).json({message: 'Error in fetching'});
    }
});

//? Fetch Details of an Event
//* WORKING!
router.get(`/:eventid`, async (req,res) => {
    const eventid = req.params.eventid;
    try {
        const result = await event.fetchEventDetails(eventid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: 'Error in Fetching Event Details!'});
    }
});

const fs = require('fs');
router.post('/deleteEvent', async(req,res) => {
    const eventid = req.body.eventid;
    try {
        const deleteFiles = await event.deleteEvent(eventid);
        for(let i=0; i<deleteFiles.length; i++) {
            fs.unlinkSync(`public${deleteFiles[i].eventfile}`);
        }
        res.status(200).json({message:'Deleted Successfully!'});
    } catch (error) {
        console.error('Error in Deleting Task:', error);
        res.status(500).json({message: 'Error in Deleting Task!'});
    }
})



const uploadItems = uploadFiles.fields([
    {name:'eventImage', maxCount: 1},
    {name:'eventFiles'},
    {name:'speakerimage'}
])

router.post('/create/:multerid', uploadItems,  async (req,res) => {
    const eventhead = req.params.multerid;
    let eventFiles = [];
    let eventImage = '';
    let speakerImages = [];
    if(req.files['eventFiles'] !== undefined)
    eventFiles = req.files['eventFiles'].map(file => ({
        path: file.path.replace('public', ''),
        mimetype: file.mimetype,
        filename: file.originalname
    }));
    if(req.files['eventImage'] !== undefined)
    eventImage = req.files['eventImage'][0].path.replace('public', '')
    if(req.files['speakerimage'] !== undefined)
    speakerImages = req.files['speakerimage'].map(file => file.path.replace(/public/g, ''));

    const date = new Date(req.body.eventdate);
    const postgresDate = date.toISOString().split('T')[0];
    const time = new Date(req.body.eventtime);
    const postgresTime = time.toISOString().split('T')[1].split('.')[0];
    const speakers = req.body.speakers ? Array.isArray(req.body.speakers) ? req.body.speakers : [req.body.speakers] : [];
    const attendees = Array.isArray(req.body.attendees) ? req.body.attendees : [req.body.attendees];
    const eventInstance = {
        eventtitle: req.body.eventtitle,
        eventdescription: req.body.eventdescription,
        eventdate: postgresDate,
        eventtime: postgresTime,
        gmapembed: req.body.gmapembed,
        eventimage: eventImage,
        eventimage: eventImage,
        attendees: attendees,
        speakers: speakers.map(JSON.parse),
        speakerImages: speakerImages,
        batch : req.body.batch
    }
    try {
        const result = await event.createEvent(eventFiles, eventInstance, eventhead);
        const emails = result.map(email => email.email);
        const emaiLObj = {
            to: emails,
            subject: 'New Event assigned to you: ' + eventInstance.eventtitle,
            image: 'newevent.png',
            name: 'you!',
            body: `A new event has been assigned to you. Please check the event section in your dashboard for more details.`,
            showButton: false,
            verificationLink: ''
        }
        await sendMail(emaiLObj);
        res.status(200).json({message: 'Event Created Successfully!'});
    } catch (error) {
        console.error('Error in Creating Event:', error);
        res.status(500).json({message: 'Error in Creating Event!'});
    }
});





module.exports = router;