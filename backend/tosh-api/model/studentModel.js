const client = require('../connectDB');

class SparesStudentModel {
    async createStudent(email, name, password, salt, dob, matricNumber, institution) {
        const query = {
            text: `insert into "Student" (
                email, name, password, salt, dob, matricNumber, 
                institution, isStudent, isStaff) values 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                returning userid, verificationkey
                ` ,
            values: [email, name, password, salt, dob, matricNumber, institution, true, false],
        }
        const res = await client.query(query);
        return res.rows[0];
    }

    async fetch(offset, limit) {
        const query = {
            text: `select * from "Student" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchSpecifiedStudent(userID) {
        const query = {
            text: `select 
            * from "Student" 
            left join "Batch" on "Student".batchid = "Batch".batchid
            where userid = $1;`,
            values: [userID]
        }
        const res = await client.query(query);
        const checkProject = {
            text: `select projectid, requeststatus from "ProjectStudent" where studentid = $1;`,
            values: [res.rows[0].studentid]
        }
        const project = await client.query(checkProject);
        const studentItem = {...res.rows[0], ...project.rows[0]};
        return studentItem;
    }

    async fetchStudentsBatch(studentID) {
        const query = {
            text: `select "Batch".*
            from "Batch" join "StudentBatch" on "Batch".batchid = "StudentBatch".batchid
            where "Student".studentid = $1;`,
            values: [studentID]
        }
        const res = await client.query(query);
        return res.rows[0];
    }

    async fetchStudentByUni(UniName) {
        const query = {
            text: `select * from "Student" where institution = $1 and batchid is null order by studentid desc;`,
            values: [UniName]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchStudentByProject(staffid, batchid) {
        const query = {
            text: `
                select "Student".*
                from "Student"
                left join "ProjectStudent" on "Student".studentid = "ProjectStudent".studentid
                right join "Project" on "ProjectStudent".projectid = "Project".projectid
                where "Project".supervisorid = $1 and "Project".status = 'approved' and "Batch".batchid = $2;
            `,
            values: [staffid, batchid]
        }
        const res = await client.query(query);
        return res.rows;
    }

}

module.exports = SparesStudentModel;

/**
 * todo:
 * 1. Prepared Statements
 * 2. User Model
 * 3. Revision of every routes
 */