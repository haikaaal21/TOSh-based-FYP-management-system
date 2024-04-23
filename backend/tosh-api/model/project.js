const client = require('../connectDB');

class Project {

	async fetchProjects(batchid, limit, offset) {
		const query = {
			name: 'fetch-projects',
			text: `
				select projectid, projecttitle, projectdescription, projecttype, projectimage,
				"AcademicStaff".name as supervisorname
				from "Project"
				join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid
				where batchid = $1 and approvalstatus = true
				limit $2 offset $3;
			`,
			values: [batchid, limit, offset]
		};
		const res = await client.query(query);
		return res.rows;
	}

	async fetchMyProject(userid) {
		const query = {
			name: 'fetch-my-project',
			text: `
				select *
				from "ProjectStudent"
				inner join "Project" on "ProjectStudent".projectid = "Project".projectid
				where studentid = $1 and requeststatus = true;
			`,
			values: [userid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async fetchProjectDetails(projectid) {
		const query = {
			name: 'fetch-project-details',
			text:`
				SELECT projectid, projecttitle, projectdescription, projecttype, projectimage,
				"AcademicStaff".name AS supervisorname, "AcademicStaff".email AS supervisoremail
				FROM "Project"
				JOIN "AcademicStaff" ON "Project".supervisorid = "AcademicStaff".staffid
				WHERE projectid = $1;
		 
			`,
			values: [projectid]
		};
		const res = await client.query(query);
		return res.rows;
	}
	
}

module.exports = Project;
