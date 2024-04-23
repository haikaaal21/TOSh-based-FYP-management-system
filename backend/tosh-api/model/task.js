const client = require('../connectDB');

class Task {
    async fetchTaskByUserId(userID, limit, offset) {
        const query = {
            name: 'fetch-task',
            text:`
              select "Task".taskid, tasktitle, duedate, tasksubmitted, iscoordinator, name
              from "TaskUser" 
              inner join "Task" on "TaskUser".taskid = "Task".taskid 
              inner join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
              where "TaskUser".userid = $1 and "Task".tasksubmitted = false
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
            name: 'fetch-task-details',
            text:`
                select * 
                from "Task"
                inner join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
                where "Task".taskid = $1
            `,
            values: [taskid]
        };
        const res = await client.query(query);
        return res.rows;
    }

    async fetchTaskFiles(taskid) {
        const query = {
            name : 'fetch-task-files',
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
            name:`submit-task`,
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
}

module.exports = Task;