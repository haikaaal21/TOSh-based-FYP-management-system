const client = require('../connectDB');

class Event {
    async fetchEvents(userid, limit, offset) {
        const query = {
                text: `select "Event".eventid, eventtitle, eventdate, eventtime, eventimage, "AcademicStaff".name as eventhead, "AcademicStaff".iscoordinator as iscoordinator
                        from "EventUser" 
                        inner join "Event" on "EventUser".eventid = "Event".eventid
                        inner join "AcademicStaff" on "Event".eventhead = "AcademicStaff".staffid
                        where assignedto = $1 
                        order by eventdate asc
                        limit $2 offset $3;`,
                values : [userid, limit, offset]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchEventDetails(eventid) {
        const eventDetailQuery = {
            text: `select * from "Event" 
            where "Event".eventid = $1`,
            values : [eventid]
        }
        const res = await client.query(eventDetailQuery);
        const speakersQuery = {
            text: `select * from "EventSpeaker" where eventid = $1`,
            values : [eventid]
        }
        const speakers = await client.query(speakersQuery);
        const documentsQuery = {
            text: `select * from "EventFiles" where eventid = $1`,
            values : [eventid]
        }
        const documents = await client.query(documentsQuery);
        const eventDetail = {
            ...res.rows[0],
            speakers: speakers.rows,
            documents: documents.rows
        }
        return eventDetail;
    }
}

module.exports = Event;