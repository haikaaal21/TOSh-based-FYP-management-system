const client = require('../connectDB');

class Project {

	async fetchProjects(batchid, limit, offset, userid, searchValue, filterValue) {
		let queryText = `select projectid, projecttitle, projectdescription, projecttype, projectimage, "AcademicStaff".name as supervisorname
		from "Project"
		join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid join "User" on "AcademicStaff".institution = "User".institution
		where batchid = $1 and approvalstatus = true and "User".userid = $4`
		let values = [batchid, limit, offset, userid];
		let count = 5;
		if (searchValue !== null) {
			queryText += ` and projecttitle ilike '%' || $${count} || '%'`;
			values.push(searchValue);
			count++;
		}
		if (filterValue !== null) {
			queryText += ` and projecttype = $${count}`;
			values.push(filterValue);
			count++;
		}
		queryText += ' limit $2 offset $3';
		const query = {
			text: queryText,
			values: values
		};
		const res = await client.query(query);
		return res.rows;
	}

	async getMine(studentid, userid = null) {
		const query = {
			text: `
			select "Project".*, "AcademicStaff".*
			from "Project"
			join "ProjectStudent" on "Project".projectid = "ProjectStudent".projectid
			join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid
			where "ProjectStudent".studentid = $1 and "ProjectStudent".requeststatus = true;
			`,
			values: [studentid]
		}
		const project = await client.query(query);
		const supervisor = project.rows[0].supervisorid;
		const query2 = {
			text:`
				select "Task".*
				from "Task" 
				join "TaskUser" on "Task".taskid = "TaskUser".taskid
				where "Task".assignedfrom = $1 and "TaskUser".userid = $2;
			`,
			values: [supervisor, userid]
		}
		const tasks = await client.query(query2);
		const query3 = {
			text:`
				select "Event".*
				from "Event"
				join "EventUser" on "Event".eventid = "EventUser".eventid
				where "Event".eventhead = $1 and "EventUser".assignedto = $2;`,
			values: [supervisor, userid]
		}
		const events = await client.query(query3);
		return {project: project.rows, tasks: tasks.rows, events: events.rows};
	}

	async fetchTags () {
		const query = {
			text: `
				select * from "Tag";
			`
		}
		const res = await client.query(query);
		return res.rows;
	}

	async fetchMyProject(studentid) {
		const query = {
			text: `
				select *
				from "ProjectStudent"
				join "Project" on "ProjectStudent".projectid = "Project".projectid
				join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid
				where studentid = $1;
			`,
			values: [studentid]
		}
		const res = await client.query(query);
		return res.rows;
	}

    async truncateProject(projectid) {
		const getFiles = {
			text: `
				select projectimage, intromarkdown from "ProjectBin" where projectid = $1;
			`,
			values: [projectid]
		}
        const query = {
            text: `
                delete from "ProjectBin" where projectid = $1
            `,
            values: [projectid]
        }
        const files = await client.query(getFiles);
		await client.query(query);
        return files.rows[0];
    }


	async fetchProjectDetails(projectid) {
		const query = {
			text:`
			SELECT "Project".* ,"AcademicStaff".name AS supervisorname, "AcademicStaff".email AS supervisoremail, "AcademicStaff".staffid AS supervisorid, "Batch".batchstatus
			FROM "Project"
			JOIN "AcademicStaff" ON "Project".supervisorid = "AcademicStaff".staffid
			JOIN "Batch" on "Project".batchid = "Batch".batchid
			WHERE projectid = $1;
		 
			`,
			values: [projectid]
		};
		const studentQuery = {
			text:`
				select profilepic, name from "Student"
				join "ProjectStudent" on "Student".studentid = "ProjectStudent".studentid
				where projectid = $1 and requeststatus = true;
			`,
			values: [projectid]
		}
		const res = await client.query(query);
		const students = await client.query(studentQuery);
		const project = {
			...res.rows[0],
			students: students.rows
		}
		return project;
	}

	async accordeclineRequest(projectid, studentid, acc) {
		let query;
		if (acc) {
			query = {
				text: `
					update "ProjectStudent"
					set requeststatus = true
					where projectid = $1 and studentid = $2;
				`,
				values: [projectid, studentid]
			}
		} else {
			query = {
				text: `
					delete from "ProjectStudent"
					where projectid = $1 and studentid = $2;
				`,
				values: [projectid, studentid]
			}
		}
		const res = await client.query(query);
		return res.rows;
	}

	async checkProjectStudent(projectid, studentid) {
		const query = {
			text: `
				select * from "ProjectStudent"
				where projectid = $1 and studentid = $2;
			`,
			values: [projectid, studentid]
		}
		const res = await client.query(query);
		return res.rows;
	
	}

	async openCloseProject(projectid, open) {
		const query = {
			text:`
				update "Project"
				set recruitment = $2
				where projectid = $1;
			`,
			values: [projectid, open]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async requestToPartakeinProject(projectid, studentid) {
		const query = {
			text:`
				insert into "ProjectStudent" (projectid, studentid) values ($1, $2);
			`,
			values : [projectid, studentid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async fetchStaffProjects(staffid) {
		const retrieveProject = {
			text: `
				select "Project".*, "Batch".batchname, (
					select count(*) 
					from "ProjectStudent" 
					where projectid = "Project".projectid AND approvalstatus = false
				) as pendingrequests
				from "Project" 
				inner join "Batch" on "Project".batchid = "Batch".batchid
				where supervisorid = $1
				order by "Batch".batchyear desc;
			`,
			values : [staffid]
		}
		const requestedForDeletion = {
			text: `
				select "ProjectBin".*,
				"Batch".batchname
				from "ProjectBin"
				inner join "Batch" on "ProjectBin".batchid = "Batch".batchid
				where supervisorid = $1
				order by "Batch".batchyear desc;
				`,
			values: [staffid]
		}
		const onDeletion = await client.query(requestedForDeletion);
		const projectItems = await client.query(retrieveProject);
		const projects = {
			projects: projectItems.rows, onDeletion: onDeletion.rows
		}
		return projects;
	}

	async fetchProjectTypes() {
		const query = {
			text: `
				select * from tag;`
		}
		const res = await client.query(query);
		return res.rows;
	}

	async createProject(projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, intromarkdown) {
		const query = {
			text: `
				insert into "Project"
				(projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, intromarkdown)
				values ($1, $2, $3, $4, $5, $6, $7);
			`,
			values: [projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, intromarkdown]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async editProject(projectid ,projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, intromarkdown) {
		let editingQuery = `
			update "Project"
			set projecttitle = $2, projectdescription = $3, projecttype = $4, supervisorid = $5, batchid = $6, intromarkdown = $7, approvalstatus = false
		`;
		if(projectimage !== null) {
			editingQuery += `, projectimage = $8`;
		}
		editingQuery += ` where projectid = $1;`;
		let values = [projectid, projecttitle, projectdescription, projecttype, supervisorid, batchid, intromarkdown];
		if(projectimage !== null) {
			values.push(projectimage);
		}
		const query = {
			text: editingQuery,
			values: values
		}
		const res = await client.query(query);
		return res.rows;
	}

	async getProjectFiles(projectid) {
		const query = {
			text: `
				select projectimage, intromarkdown from "Project" where projectid = $1;
			`,
			values:[projectid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async deleteProject(projectid) {
		const query = {
			text: `
				delete from "Project" where projectid = $1;
			`,
			values: [projectid]
		}
		const deleteParticipants = {
			text: `
				delete from "ProjectStudent" where projectid = $1;
			`,
			values: [projectid]
		}
		await client.query(deleteParticipants);
		const res = await client.query(query);
		return res.rows;
	}

	async restoreProject(projectid) {
		const query ={
			text: `
				insert into "Project" (projectid, projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, approvalstatus, intromarkdown)
				select projectid, projecttitle, projectdescription, projecttype, projectimage, supervisorid, batchid, false, intromarkdown
				from "ProjectBin"
				where projectid = $1;
			`,
			values: [projectid]
		}
		const deleteFromBin = {
			text: `
				delete from "ProjectBin" where projectid = $1;
			`,
			values: [projectid]
		}
		await client.query(query);
		await client.query(deleteFromBin);
		return true;
	}

	async fetchUnapproved(batchid) {
		const query = {
			text:`
				select "Project".*, "AcademicStaff".name, "AcademicStaff".staffid from "Project"
				left join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid
				where batchid = $1 and approvalstatus = false;
			`,
			values: [batchid]
		}
		const onDeletionQ = {
			text:`
				select "ProjectBin".*, "AcademicStaff".name, "AcademicStaff".staffid from "ProjectBin"
				left join "AcademicStaff" on "ProjectBin".supervisorid = "AcademicStaff".staffid
				where batchid = $1;`,
			values: [batchid]
		}
		const onDeletion = await client.query(onDeletionQ);
		const res = await client.query(query);
		const projectOBJ = {
			projects: res.rows, onDeletion: onDeletion.rows
		}
		return projectOBJ;
	}

	async approveProject(projectid) {
		const query = {
			text:`
				update "Project"
				set approvalstatus = true
				where projectid = $1;
			`,
			values : [projectid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async declineProject(projectid) {
		const query = {
			text:`
				delete from "Project" where projectid = $1;
			`,
			values : [projectid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async fetchRequests(projectid) {
		const query = {
			text:`
				select "ProjectStudent".*, "Student".*
				from "ProjectStudent"
				join "Student" on "ProjectStudent".studentid = "Student".studentid
				where "ProjectStudent".projectid = $1 and requeststatus = false;
			`,
			values: [projectid]
		}
		const secquery = {
			text:`
				select "Project".recruitment, "Project".approvalstatus
				from "Project"
				where projectid = $1;
			`,
			values: [projectid]
		}
		const res = await client.query(query);
		const secres = await client.query(secquery);
		return {requests: res.rows, projectstatus: secres.rows[0]};
	}
	
}


module.exports = Project;
