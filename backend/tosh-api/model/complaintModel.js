const client = require('../connectDB');

class complaintModel {

    async fetchUserStudentComplaints(studentid) {
        const query = {
            text : `
                select * from "Complaint"
                where studentid = $1
                order by complaintdate desc
            `,
            values: [studentid]
        }
        console.log(query);
        const res = await client.query(query);
        return res.rows;
    }

    async createComplaint(studentid, complaint, dateCreated) {
        const complaintItem = {
            complainttitle: complaint.complainttitle,
            complaintdescription: complaint.complaintdescription,
        }
        const query = {
            text : `
                insert into "Complaint" (complainttitle, complainttext, studentid, complaintdate)
                values ($1, $2, $3, $4)
                returning complaintid
            `,
            values: [complaintItem.complainttitle, complaintItem.complaintdescription, studentid, dateCreated]
        }
        const res = await client.query(query);
        const complaintID = res.rows[0].complaintid;
        return complaintID;
    }

    async insertComplaintFiles(complaintid, file) {
        const filedirectories = file.path.replace('public', '')
        console.log(filedirectories);
        const query = {            
            text : `
                insert into "ComplaintFile" (complaintid, complaintfilename, complaintfiletype, complaintfiletitle) values ($1, $2, $3, $4)`,
            values: [complaintid, filedirectories, file.mimetype, file.originalname]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchComplaint(complaintid) {
        const complaintquery = {
            text: 'select * from "Complaint" where complaintid = $1',
            values: [complaintid]
        }
        const complaintdetails = await client.query(complaintquery);
        const updatenotif = {
            text:'update "Complaint" set complaintnotification = 0'
        }
        const updatenotifres = await client.query(updatenotif);
        const complaintfilesquery = {
            text: 'select * from "ComplaintFile" where complaintid = $1',
            values: [complaintid]
        }
        const complaintfiles = await client.query(complaintfilesquery);
        const complaintreplyquery = {
            text: `select complaintreplyid, complaintreplytext, complaintreplydate  "ComplaintReply", "User".name, "User".profilepic
            from "ComplaintReply"
            inner join "User" on "ComplaintReply".userid = "User".userid
            where complaintid = $1
            order by complaintreplydate desc
            `,
            values: [complaintid]
        }
        const complaintreplies = await client.query(complaintreplyquery);
        const complaint = {
            details: complaintdetails.rows[0],
            files: complaintfiles.rows,
            replies: complaintreplies.rows
        }
        return complaint;
    }

    async createReply(complaintid, userid, reply) {
        const query = {
            text: `
                insert into "ComplaintReply" (complaintid, userid, complaintreplytext)
                values ($1, $2, $3)
            `,
            values: [complaintid, userid, reply]
        }
        console.log(query);
        const res = await client.query(query);
        return res.rows;
    }

}

module.exports = complaintModel;