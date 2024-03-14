const client = require('../connectDB');

class SparesStudentModel {
    async createStudent(email, name, password, salt, dob, matricNumber, institution) {
        const query = {
            name: 'create-user-student',
            text: `insert into "Student" (email, name, password, salt, dob, matricNumber, institution, isStudent, isStaff) values ($1, $2, $3, $4, $5, $6, $7, $8, $9);` ,
            values: [email, name, password, salt, dob, matricNumber, institution, true, false],
        }
        const res = await client.query(query);
        return res.rows[0];
    }

    async fetchAllStudents() {
        const query = {
            name: 'fetch-all-students',
            text: `select * from "Student";`
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