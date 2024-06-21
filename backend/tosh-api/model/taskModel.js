const client = require('../connectDB');

class Task {

    async fetchTaskByUserId(userID, limit, offset, after = false) {
        let queryText = `
            SELECT "Task".taskid, tasktitle, duedate, iscoordinator, name, "TaskUser".submissionstatus
            FROM "TaskUser" 
            INNER JOIN "Task" ON "TaskUser".taskid = "Task".taskid 
            INNER JOIN "AcademicStaff" ON "Task".assignedfrom = "AcademicStaff".staffid
            WHERE "TaskUser".userid = $1
        `;
    
        if(after) {
            queryText += ' AND "Task".duedate > CURRENT_DATE';
        }
    
        queryText += ' ORDER BY duedate ASC LIMIT $2 OFFSET $3';
    
        const query = {
            text: queryText,
            values: [userID, limit, offset]
        };
    
        const res = await client.query(query);
        return res.rows;
    }

    async fetchTaskDetails(taskid, userid) {
        let queryText = `select * 
        from "Task"
        inner join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
        left join "TaskUser" on "Task".taskid = "TaskUser".taskid
        where "Task".taskid = $1`;
        let values = [taskid];
        const query = {
            text: queryText,
            values: values
        };
        const res = await client.query(query);
        const searchQuery = {
            text: `
                select userid from "AcademicStaff"
                where staffid = $1`,
            values: [res.rows[0].assignedfrom]
        }
        const staff = await client.query(searchQuery);
        let submissionstuff;
        if(staff.rows[0].userid !== parseInt(userid)) {
            const submissionQuery = {
                text: `
                    select submissionstatus from "TaskUser"
                    where taskid = $1 and userid = $2`,
                values: [taskid, userid]
            }
            submissionstuff = await client.query(submissionQuery);
            res.rows[0].submissionstatus = submissionstuff.rows[0].submissionstatus;
        }
        const fileQUery = {
            text:`
                select *
                from "TaskFiles"
                where taskid = $1
            `,
            values: [taskid]
        };
        const files = await client.query(fileQUery);
        const item = {
            task: res.rows[0],
            files: files.rows
        }
        return item;
    }

    async fetchTaskFiles(taskid) {
        const query = {
            text:`
                select *
                from "TaskFiles"
                where taskid = $1
            `,
            values: [taskid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async submitTask(taskid, taskfile, userid, typeoffile, filename){
        const query = {
            text:`
                insert into "TaskSubmissionFile"
                (taskid, tasksubmissionfile, userid, typeoffile, filename)
                values ($1, $2, $3, $4, $5)
            `,
            values: [taskid, taskfile, userid, typeoffile, filename]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async submittedTask(taskid, userid) {
        const query = {
            text: `UPDATE "TaskUser"
                   SET submissionstatus = true
                   WHERE taskid = $1 AND userid = $2`,
            values: [taskid, userid]
        }
        const assignedFromEmail = {
            text: `select "AcademicStaff".email from "AcademicStaff"
                    join "Task" on "AcademicStaff".staffid = "Task".assignedfrom
                    where taskid = $1`,
            values: [taskid]
        }
        const res = await client.query(query);
        const email = await client.query(assignedFromEmail);
        return email.rows[0];
    }

    async createTask(taskFiles, taskInstance) { 
        const query = {
            text: `
                insert into "Task"
                (tasktitle, taskdescription, duedate, yellowzone, redzone, lock, assignedfrom, batchid)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning taskid
            `,
            values: [taskInstance.tasktitle, taskInstance.taskdescription, taskInstance.duedate, taskInstance.yellowzone, taskInstance.redzone, taskInstance.lock, taskInstance.assignedfrom, taskInstance.batchid]
        }
        const id = await client.query(query);
        const taskid = id.rows[0].taskid;
        for(let i=0; i<taskFiles.length; i++) {
            const directory = taskFiles[i].path.replace('public', '');
            const fileQuery = {
                text: `
                    insert into "TaskFiles"
                    (taskid, taskfile, taskfilename, filetype)
                    values ($1, $2, $3, $4)
                `,
                values: [taskid, directory, taskFiles[i].originalname, taskFiles[i].mimetype]
            }
            await client.query(fileQuery);
        }
        for(let i=0; i<taskInstance.assignedto.length;i++) {
            const userQuery = {
                text: `
                    insert into "TaskUser"
                    (taskid, userid)
                    values ($1, $2)
                `,
                values: [taskid, taskInstance.assignedto[i]]
            }
            await client.query(userQuery);
        }
        const getEmails = {
            text: `select "User".email from "User" 
                    join "TaskUser" on "User".userid = "TaskUser".userid
                    where "TaskUser".taskid = $1`,
            values: [taskid]
        }
        const emails = await client.query(getEmails);
        return emails.rows;
    }

    async fetchTaskFromCreator(specialid) {
        const query = {
            text: `
                select * from "Task"
                where assignedfrom = $1
            `,
            values: [specialid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async rollbackSubmission(taskid, userid) {
        const filesToUnlink = {
            text:`select tasksubmissionfile from "TaskSubmissionFile" where taskid = $1 and userid = $2`,
            values: [taskid, userid]
        }
        const deleteFiles = {
            text:`
                delete from "TaskSubmissionFile"
                where taskid = $1 and userid = $2
            `,
            values: [taskid, userid]
        }
        const updateSubmission = {
            text:`
                update "TaskUser"
                set submissionstatus = false
                where taskid = $1 and userid = $2
            `,
            values: [taskid, userid]
        }
        const files = await client.query(filesToUnlink);
        await client.query(deleteFiles);
        await client.query(updateSubmission);
        return files.rows;
    }

    async getSubmissions(taskid) {
        const userQuery = {
            text: `
                select "TaskUser".userid, "User".name, "User".profilepic, "User".matricnumber from "TaskUser"
                join "User" on "TaskUser".userid = "User".userid
                where taskid = $1 and "TaskUser".submissionstatus = true
            `,
            values: [taskid]
        }
        const users = await client.query(userQuery);
        for(let i=0; i<users.rows.length; i++) {
            const fileQuery = {
                text: `
                    select * from "TaskSubmissionFile"
                    where taskid = $1 and userid = $2
                `,
                values: [taskid, users.rows[i].userid]
            }
            const files = await client.query(fileQuery);
            users.rows[i].files = files.rows;
        }
        return users.rows;
    }

    async editTask(taskid, taskinstance) {
        const query = {
            text: `
                update "Task"
                set tasktitle = $1, taskdescription = $2, duedate = $3, lock = $4
                where taskid = $5
            `,
            values: [taskinstance.tasktitle, taskinstance.taskdescription, taskinstance.duedate, taskinstance.lock, taskid]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchRecipients(taskid) {
        const userQ = {
            text:`
                select "User".name, "User".matricnumber, "User".email
                from "TaskUser"
                join "User" on "TaskUser".userid = "User".userid
                where taskid = $1 and "TaskUser".submissionstatus = false
            `,
            values: [taskid]
        }
        const taskQ = {
            text:`
                select "Task".tasktitle, "Task".duedate from "Task"
                where taskid = $1
            `,
            values: [taskid]
        }
        const task = await client.query(taskQ);
        const users = await client.query(userQ);
        return {task: task.rows[0], users: users.rows};
    }

    async deleteTask(taskid) {
        const values = [taskid];
        const query = {
            text:`
                delete from "Task"
                where taskid = $1
                `,
                values: values
        }
        const query2 = {
            text:`
                delete from "TaskUser"
                where taskid = $1
                `,
                values: values
        }
        const query3 = {
            text:`
                select taskfile from "TaskFiles"
                where taskid = $1
                `,
                values: values
        }
        const query4 = {
            text:`
                delete from "TaskFiles"
                where taskid = $1
                `,
                values: values
        }
        await client.query(query2);
        const files = await client.query(query3);
        await client.query(query4);
        await client.query(query);
        return files.rows;
    }
}

module.exports = Task;