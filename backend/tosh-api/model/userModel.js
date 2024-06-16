const client = require('../connectDB');
const bcrypt = require('bcrypt');

class User {

    async forgotPass(email, pass) {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(pass, salt);
        const check = {
            text: `select userid from "User" where email = $1;`,
            values: [email]
        }
        const checkItem = await client.query(check);
        if(checkItem.rows.length === 0) {
            return false;
        } else {
            const query = {
                text: `
                    update "User" set password = $1, salt = $2, verified = false
                    where email = $3
                    returning userid, verificationkey;
                `,
                values: [hashedPassword, salt, email]
            }
            const res = await client.query(query);
            return res.rows[0];
        }
    }

    async searchUser(valueToSearch, columnTarget){
        const query = {
            text: `select * from "User" where ${columnTarget} = $1;`,
            values: [valueToSearch]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchAll() {
        const query = {
            text: `select * from "User";`
        }
        const res = await client.query(query);
        return res.rows;
    }

    async verify(uid, key) {
        const query = {
            text: `select userid from "User" where userid = $1 and verificationkey = $2;`,
            values: [uid, key]
        }
        let itemExists;
        try {
        itemExists = await client.query(query);
        } catch (err) {
            return false;
        }
        if(itemExists.rows.length === 0) {
            return false;
        } else {
            const secondQuery = {
                text: `update "User" set verified = true where userid = $1;`,
                values: [uid]
            }
            await client.query(secondQuery);
            return true;
        }
    }

    async editBasic(userInstance, uid) {
        let queryText =  `
        update "User" set name = $2, dob = $3, institution = $4
        `;
        let itemValues = [uid, userInstance.name, userInstance.dob, userInstance.institution];
        if(userInstance.profilepic) {
            queryText += `, profilepic = $5 `;
            itemValues.push(userInstance.profilepic);
        }
        queryText += `where userid = $1;`;
        const query = {
            text:queryText,
            values: itemValues
        }
        await client.query(query);
        return true;
    }

    async editSuper(userInstance, uid) {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(userInstance.password, salt);
        try {  
            const query = {
                text : `
                    update "User" set email=$1, password=$2, salt=$3, verified = false
                    where userid = $4
                    returning verificationkey;
                `,
                values: [userInstance.email, hashedPassword, salt, uid]
            }
            const verifKey = await client.query(query);
            return verifKey.rows[0].verificationkey;
        } catch(error) {
            return false;
        }
    }

    async socketFetch(institution = null, offset = 0) {
        let queryText = `select name, isstaff, institution, profilepic, shamepoints from "User"`;
        if (institution) {
            queryText += ` where institution = $2 `;
        }
        queryText += ` order by shamepoints desc limit 5 offset $1;`;
        let values = [offset];
        if (institution) {
            values.push(institution);
        }
        const query = {
            text: queryText,
            values: values
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchByUni(uni, batchid) { 
        const query = {
            text: `select "User".*
                from "User"
                left join "Student" on "User".userid = "Student".userid
                left join "AcademicStaff" on "User".userid = "AcademicStaff".userid
                left join "BatchSupervisor" on "AcademicStaff".staffid = "BatchSupervisor".supervisorid
                where "User".institution = $1 and ("Student".batchid = $2 or "BatchSupervisor".batchid = $2);`,
            values: [uni, batchid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchByProject(staffid, batchid) {
        const query = {
            text: `select projectid
                from "Project"
                where supervisorid = $1 and batchid = $2;
            `,
            values: [staffid, batchid]
        }
    
        const res = await client.query(query);
        const projectIds = res.rows.map(row => row.projectid);
    
        const students = [];
        for (let projectId of projectIds) {
            const queryUsers = {
                text: `select "Student".*
                    from "Student"
                    left join "ProjectStudent" on "Student".studentid = "ProjectStudent".studentid
                    where "ProjectStudent".projectid = $1 and requeststatus = true;
                `,
                values: [projectId]
            }
    
            const resUsers = await client.query(queryUsers);
            students.push(...resUsers.rows);
        }
    
        return students;
    }
    

    async fetch(offset, limit) {
        const query = {
            text: `select * from "User" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async updateUserProfile(userid, name, email, dob, institution, salt, password, profilepic) {
        const query = {
            text:`
                update "User" set name = $1, email=$2, password=$3, dob=$4, institution=$5, salt=$6, profilepic=$7
                where userid = $8;
            `,
            values: [name, email, password, dob, institution, salt, profilepic, userid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchByShame(offset, limit) {
        /** !
         * Order by Overdue tasks, Redzone, and Yellowzone,
         * Overdue tasks = 5 points, Redzone = 3 points, Yellowzone = 1 point
         * make 3 SQL queries, merge results, and order by points
         * 
         * Make an algorithm for this as a middleware
         */

        const query = {
            
        }
        
    }
}

module.exports = User;