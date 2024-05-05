const client = require('../connectDB');

class SparesStudentModel {
    async createStudent(email, name, password, salt, dob, matricNumber, institution) {
        const query = {
            text: `insert into "Student" (
                email, name, password, salt, dob, matricNumber, 
                institution, isStudent, isStaff) values 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9);` ,
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
            text: `select * from "Student" where userid = $1;`,
            values: [userID]
        }
        const res = await client.query(query);
        return res.rows[0];
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
}

module.exports = SparesStudentModel;

/**
 * todo:
 * 1. Prepared Statements
 * 2. User Model
 * 3. Revision of every routes
 */