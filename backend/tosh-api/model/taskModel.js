const client = require('../connectDB');

class Task {
    async fetchTaskByUserId(userID, limit, offset) {
        const query = {
            text:`
              select "Task".taskid, tasktitle, duedate, iscoordinator, name
              from "TaskUser" 
              inner join "Task" on "TaskUser".taskid = "Task".taskid 
              inner join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
              where "TaskUser".userid = $1 and "TaskUser".submissionstatus = false
              order by duedate asc
                limit $2 offset $3
            `,
            values: [userID, limit, offset]
        };
        const res = await client.query(query);
        return res.rows;
    }

    async fetchTaskDetails(taskid) {
        const query = {
            text:`
                select * 
                from "Task"
                inner join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
                inner join "TaskUser" on "Task".taskid = "TaskUser".taskid
                where "Task".taskid = $1
            `,
            values: [taskid]
        };
        const res = await client.query(query);
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

    //! Experimental
    async submitTask(taskid, taskFile) {
        const query = {
            text:`
                insert into "TaskSubmissionFile" 
                (taskid, tasksubmissionfile) 
                values ($1, $2)`,
            values: [taskid, taskFile]            
        }
        const res = await client.query(query);
        if(res.rows.length === 1){
            const submittedQuery = {
                name: `task-submitted`,
                text: `
                    update "Task"
                    set tasksubmitted = true
                    where taskid = $1
                    `,
                values: [taskid]
            }
            const submittedRes = await client.query(submittedQuery);
            return submittedRes.rows;
        } else {
            return res.rows;
        }
    }

    //! Make a task locking mechanism and consider making a trigger for the task submission so the submitted gets updated
    //! Use CRON

    async submitTask(taskid, taskfile, userid, typeoffile){
        const query = {
            text:`
                insert into "TaskSubmissionFile"
                (taskid, tasksubmissionfile, userid, typeoffile)
                values ($1, $2, $3, $4)
            `,
            values: [taskid, taskfile, userid, typeoffile]
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
        const res = await client.query(query);
        return res.rows;
    }
}

module.exports = Task;