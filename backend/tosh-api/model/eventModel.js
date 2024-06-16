const client = require('../connectDB');

class Event {
    async fetchEvents(userid, limit, offset, after = false) {
        let queryText = `
            SELECT "Event".eventid, eventtitle, eventdate, eventtime, eventimage, "AcademicStaff".name as eventhead, "AcademicStaff".iscoordinator as iscoordinator
            FROM "EventUser" 
            INNER JOIN "Event" ON "EventUser".eventid = "Event".eventid
            INNER JOIN "AcademicStaff" ON "Event".eventhead = "AcademicStaff".staffid
            WHERE assignedto = $1
        `;
    
        if(after) {
            queryText += ' AND "Event".eventdate > CURRENT_DATE';
        }
    
        queryText += ' ORDER BY eventdate ASC LIMIT $2 OFFSET $3';
    
        const query = {
            text: queryText,
            values: [userid, limit, offset]
        };
        const res = await client.query(query);
        return res.rows;
    }

    async updateEvent(eventinstance, eventid) {
        const query = {
            text: `
                update "Event"
                set eventtitle = $1, eventdescription = $2, eventdate = $3, eventtime = $4, gmapembed = $5
                where eventid = $6
            `,
            values: [eventinstance.eventtitle, eventinstance.eventdescription, eventinstance.eventdate, eventinstance.eventtime, eventinstance.gmapembed, eventid]
        }
        await client.query(query);
        return true;
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

    async updateAttendance(eventid, whatToUpdate) {
        for(let i=0; i<whatToUpdate.length; i++) {
            const query = {
                text: `
                    update "EventUser"
                    set attended = $1
                    where eventid = $2 and assignedto = $3
                `,
                values: [whatToUpdate[i].attended, eventid, whatToUpdate[i].uid]
            }
            await client.query(query);
        }
        return true;
    }

    async getAttendance(eventid) {
        const query = {
            text: `
            select * from "EventUser"
            join "User" on "EventUser".assignedto = "User".userid
            where eventid = $1
            `,
            values: [eventid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async createEvent(eventfiles, eventInstance, staffid) {
        const createEventQuery = {
            text: `
                insert into "Event"
                (eventtitle, eventdescription, eventdate, eventtime, gmapembed, eventimage, eventhead, batch)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning eventid
            `,
            values: [eventInstance.eventtitle, eventInstance.eventdescription, eventInstance.eventdate, eventInstance.eventtime, eventInstance.gmapembed, eventInstance.eventimage, staffid, eventInstance.batch]
        }
        const eventid = await client.query(createEventQuery);
        for(let i = 0; i < eventfiles.length; i++) {
            const fileQuery = {
                text: `
                    insert into "EventFiles"
                    (eventid, eventfile, eventfilename, filetype)
                    values
                    ($1, $2, $3, $4)
                `,
                values: [eventid.rows[0].eventid, eventfiles[i].path, eventfiles[0].filename, eventfiles[i].mimetype]
            }
            await client.query(fileQuery);
        }
        for(let i=0; i<eventInstance.attendees.length; i++) {
            const attendeeQuery = {
                text:`
                    insert into "EventUser"
                    (eventid, assignedto)
                    values
                    ($1, $2)
                `,
                values: [eventid.rows[0].eventid, eventInstance.attendees[i]]
        }   
            await client.query(attendeeQuery);
        }
        const getEmails = {
            text:`
                select "User".email from "User" 
                join "EventUser" on "User".userid = "EventUser".assignedto
                where "EventUser".eventid = $1   
            `,
            values: [eventid.rows[0].eventid]
        }
        const emails = await client.query(getEmails);
        for(let i=0; i<eventInstance.speakers.length; i++) {
            const speakerQuery = {
                text:`
                    insert into "EventSpeaker"
                    (eventid, eventspeaker, eventspeakerbio, eventspeakercontact, eventspeakerimage)
                    values
                    ($1, $2, $3, $4, $5)
                    `,
                    values: [eventid.rows[0].eventid, eventInstance.speakers[i].name, eventInstance.speakers[i].bio, eventInstance.speakers[i].contact, eventInstance.speakerImages[i]]
            }
            await client.query(speakerQuery);
        }
        return emails;
    }

    async deleteEvent(eventid) {
        const values = [eventid];
        const attendeesQuery = {
            text: `delete from "EventUser" where eventid = $1`,
            values: values
        }
        const speakersQuery = {
            text: `delete from "EventSpeaker" where eventid = $1`,
            values: values
        }
        const getFiles = {
            text: `select eventfile from "EventFiles" where eventid = $1`,
            values: values
        }
        const deleteFiles = {
            text: `delete from "EventFiles" where eventid = $1`,
            values: values
        }
        const eventQuery = {
            text: `delete from "Event" where eventid = $1`,
            values: values
        }
        const files = await client.query(getFiles);
        await client.query(attendeesQuery);
        await client.query(speakersQuery);
        await client.query(deleteFiles);
        await client.query(eventQuery);
        return files.rows;
    }

    async fetchFromUni(uni) {
        const query = {
            text: `
                select "Event".*, "AcademicStaff".name
                from "Event"
                left join "AcademicStaff" on "Event".eventhead = "AcademicStaff".staffid
                where "AcademicStaff".institution = $1
                order by eventdate desc;
            `,
            values: [uni]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchEventFromCreator(specialid) {
        const query = {
            text: `
                select * from "Event"
                where eventhead = $1
            `,
            values: [specialid]
        }
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = Event;