const client = require('../connectDB');

class SparesAcademicStaffModel {

    async createAcademicStaff(email, name, password, salt, dob, matricNumber, institution, balancer ){
        let coordinator = balancer? true: false;
        let supervisor = !balancer? true:false;
        const query = {
            text: 'insert into "AcademicStaff" (email, name, password, salt, dob, matricNumber, institution, isCoordinator, isSupervisor, isStudent, isStaff) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, true);',
            values: [email, name, password, salt, dob, matricNumber, institution, coordinator, supervisor]
        }
        const result = await client.query(query);
        return result.rows[0];
    }

    async fetch(offset, limit){
        const query = {
            text: `select * from "AcademicStaff" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const result = await client.query(query);
        return result.rows;
    }

    async fetchSpecifiedAcademicStaff(userID){
        const query = {
            text: `select * from "AcademicStaff" where userid = $1;`,
            values: [userID]
        }
        const result = await client.query(query);
        return result.rows[0];
    }
    
    async fetchSupervisorByUni(UniName){
        const query = {
            text: `select * from "AcademicStaff" where institution = $1 and issupervisor = true order by staffid desc;`,
            values: [UniName]
        }
        const result = await client.query(query);
        return result.rows;
    
    }
}

module.exports = SparesAcademicStaffModel;