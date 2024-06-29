const client = require('../connectDB');

class BatchModel {

    async deleteBatch(batchid) {
        const unassignFromStudentQuery = {
            text: `update "Student" set batchid = null where batchid = $1;`,
            values: [batchid]
        }
        const unassignFromSupervisorQuery = {
            text: `delete from "BatchSupervisor" where batchid = $1;`,
            values: [batchid]
        }

        const deleteBatchDocumentationQuery = {
            text: `delete from "BatchDocumentation" where batchid = $1;`,
            values: [batchid]
        }
        const batchDeleteQuery = {
            text: `delete from "Batch" where batchid = $1;`,
            values: [batchid]
        }
        await client.query(deleteBatchDocumentationQuery);
        await client.query(unassignFromStudentQuery);
        await client.query(unassignFromSupervisorQuery);
        return await client.query(batchDeleteQuery);        
    }

    async createBatch(batchnname, batchhead, batchYear) {
        const query = {
            text: `insert into "Batch" (batchname, batchhead, batchyear) values ($1, $2, $3)
            returning batchid
            ;`,
            values: [batchnname, batchhead, batchYear]
        }
        const res = await client.query(query);
        return res.rows[0];
    }
    
    async updateStudentBatches(studentID, batchID) {
        const placeholders = studentID.map((_, i) => '$' + (i + 2)).join(',');
        const query = {
            text: `
            UPDATE "Student" SET batchid = $1
            WHERE studentid IN (${placeholders});
            `,
            values: [batchID, ...studentID]
        }
        const res = await client.query(query);
        return res.rows[0];
    }

    async createBatchSupervisor(batchID, staffIDs) {
        const tuples = staffIDs.map((id, i) => `($1, $${i + 2})`).join(', ');
        const query = {
            text: `INSERT INTO "BatchSupervisor" (batchid, supervisorid) VALUES ${tuples};`,
            values: [batchID, ...staffIDs]
        }
        const res = await client.query(query);
        return res.rows[0];
    }

    async fetchAllBatches() {
        const query = {
            text: `select * from "Batch";`
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetch(offset, limit) {
        const query = {
            text: `select * from "Batch" offset $1 limit $2;`,
            values: [offset, limit]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async fetchBatchByUni(UniName, batchstat) {
        let queryText = `
        SELECT "Batch".*, "AcademicStaff".name, "AcademicStaff".staffid,
        (
            SELECT COUNT(*) FROM "BatchSupervisor" WHERE "BatchSupervisor".batchid = "Batch".batchid
        ) AS "supervisorCount",
        (
            SELECT COUNT(*) FROM "Student" WHERE "Student".batchid = "Batch".batchid
        ) AS "studentCount",
        (
            select count(*) from "Project" where "Project".batchid = "Batch".batchid
        ) as "projectCount",
        (
            select batchdocumentation from "BatchDocumentation" where "BatchDocumentation".batchid = "Batch".batchid
            limit 1
        ) as batchimage
        FROM "Batch"
        INNER JOIN "AcademicStaff" ON "Batch".batchhead = "AcademicStaff".staffid
        WHERE "AcademicStaff".institution = $1
    `;
        if(batchstat === 1) {
            queryText += ` AND "Batch".batchstatus = 'Preparation'`;
        } else if (batchstat === 2) {
            queryText += ` AND "Batch".batchstatus = 'Preparation' or "Batch".batchstatus = 'Undergoing'`;
        }
        const query = {
            text: queryText,
            values: [UniName]
        }
        const res = await client.query(query);
        return res.rows;
    }

    async updateBatch(batchid, batchname, batchyear, batchstatus) {
        const query = {
            text: `update "Batch" set batchname = $1, batchyear = $2, batchstatus = $3 where batchid = $4;`,
            values: [batchname, batchyear, batchstatus, batchid]
        }
        return await client.query(query);
    }

    async fetchSpecifiedBatch(batchID) {
        const batchDetailsQuery = {
            text: `select * from "Batch" where batchid = $1;`,
            values: [batchID]
        }
        const batchDetails = await client.query(batchDetailsQuery);
        const supervisorQuery = {
            text: `select name, staffid, matricnumber, profilepic from "BatchSupervisor" right join "AcademicStaff" on "BatchSupervisor".supervisorid = "AcademicStaff".staffid where batchid = $1;`,
            values: [batchID]
        }
        const supervisors = await client.query(supervisorQuery);
        const studentQuery = {
            text: `select name, studentid, matricnumber, profilepic from "Student" where batchid = $1;`,
            values: [batchID]
        }
        const students = await client.query(studentQuery);
        const projectQuery = {
            text: `select "Project".*, "AcademicStaff".name as supervisorname from "Project"
            left join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid
            where batchid = $1;`,
            values: [batchID]
        }
        const projects = await client.query(projectQuery);

        const projectBinsQuery = {
            text: `select count(*) from "ProjectBin" where batchid = $1;`,
            values: [batchID]
        }
        const projectBins = await client.query(projectBinsQuery);
        const eventsQuery = { 
            text:`SELECT "Event".*, "AcademicStaff".name, "AcademicStaff".issupervisor FROM "EventBatch"
            JOIN "Event" ON "EventBatch".eventid = "Event".eventid
            RIGHT JOIN "Batch" ON "EventBatch".batchid = "Batch".batchid
            left join "AcademicStaff" on "Event".eventhead = "AcademicStaff".staffid
            WHERE "Batch".batchid = $1 and "Event".eventdate >= now() order by "Event".eventdate asc;`,
            values:[batchID]
        }
        const events = await client.query(eventsQuery);
        const tasksQuery = {
            text: `select "Task".*, "AcademicStaff".name, "AcademicStaff".issupervisor from "Task" 
            left join "AcademicStaff" on "Task".assignedfrom = "AcademicStaff".staffid
            where batchid = $1 and "Task".duedate >= now() order by "Task".duedate asc;`,
            values:[batchID]
        }
        const tasks = await client.query(tasksQuery);

        let items = [];
        tasks.rows.forEach((task) => {
            items.push({
                id: task.taskid,
                title: task.tasktitle,
                date: task.duedate,
                lecturer: task.name,
                supervisorAssigned: task.issupervisor,
                lecturerid : task.assignedfrom,
                type: 'task'
            })
        })
        events.rows.forEach((event) => {
            items.push({
                id: event.eventid,
                title: event.eventtitle,
                date: event.eventdate,
                lecturer: event.name,
                supervisorAssigned: event.issupervisor,
                lecturerid : event.eventhead,
                type: 'event'
            })
        })
        const documentationQuery = {
            text: `select * from "BatchDocumentation" where batchid = $1;`,
            values: [batchID]
        }
        const documentation = await client.query(documentationQuery);

        return {
            batch: batchDetails.rows[0],
            supervisors: supervisors.rows,
            students: students.rows,
            projects: projects.rows,
            canned: projectBins.rows[0].count,
            items: items,
            documentation: documentation.rows
        }
    }

    async uploadDocumentation (docinstance) {
        const query = {
            text: `
                insert into "BatchDocumentation" (batchid, documentationtitle, batchdocumentation)
                values ($1, $2, $3)
            `,
            values: [docinstance.batchid, docinstance.documentationtitle, docinstance.batchdocumentation]
        }
        return await client.query(query);
    }


}

module.exports = BatchModel;