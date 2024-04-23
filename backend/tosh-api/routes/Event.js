const express = require('express');
const router = express.Router();
const Event = require('../model/event');

//? Fetch Events of a user
//* WORKING!
router.get(`/:userid/:offset`,async (req,res) => {
    const offset = req.params.offset;
    const limit = 10;
    const userid = req.params.userid;
    const event = new Event();
    try {
        const result = await event.fetchEvents(userid, limit, offset);
        res.status(200).json(result);
    } catch(error) {
        console.error('Error in Fetch Event:',error);
        res.status(500).json({message: 'Error in fetching'});
    }
});

//? Fetch Details of an Event
router.get(`/:eventid`, async (req,res) => {
    const eventid = req.params.eventid;
    const event = new Event();
    console.log('Event ID:', eventid)
    try {
        const result = await event.fetchEventDetails(eventid);
        res.status(200).json(result);
    } catch (error) {
        console.log('Error in Fetching Event Details:', error);
        res.status(500).statusMessage('Error in Fetching Event Details!');
    }
});

module.exports = router;