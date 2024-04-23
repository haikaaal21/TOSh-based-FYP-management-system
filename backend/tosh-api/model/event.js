const client = require('../connectDB');

class Event {
    async fetchEvents(userid, limit, offset) {
        const query = {
                name : 'fetch-all-events',
                text: `select "Event".eventid, eventtitle, eventdate, eventtime, eventimage
                        from "EventUser" 
                        inner join "Event" on "EventUser".eventid = "Event".eventid
                        where assignedto = $1 
                        limit $2 offset $3;`,
                values : [userid, limit, offset]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchEventDetails(eventid) {
        const query = {
            name : 'fetch-event-details',
            text: `select * from "Event" where eventid = $1;`,
            values : [eventid]
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = Event;