const client = require('../connectDB');

class Project {

	async fetchProjects(batchid, limit, offset, userid, searchValue) {
		console.log(
			'batchid:', batchid,
			'limit:', limit,
			'offset:', offset,
			'userid:', userid,
			'searchValue:', searchValue
		)
		let queryText = `select projectid, projecttitle, projectdescription, projecttype, projectimage, "AcademicStaff".name as supervisorname
		from "Project"
		join "AcademicStaff" on "Project".supervisorid = "AcademicStaff".staffid join "User" on "AcademicStaff".institution = "User".institution
		where batchid = $1 and approvalstatus = true and "User".userid = $4`
		let values = [batchid, limit, offset, userid];
		if (searchValue !== undefined) {
			queryText += ` and projecttitle ilike '%' || $5 || '%'`;
			values.push(searchValue);
		}
		queryText += ' limit $2 offset $3';
		const query = {
			text: queryText,
			values: values
		};
		const res = await client.query(query);
		return res.rows;
	}

	async fetchTags () {
		const query = {
			text: `
				select * from "Tags";
			`
		}
		const res = await client.query(query);
	}

	async fetchMyProject(studentid) {
		const query = {
			text: `
				select *
				from "ProjectStudent"
				where studentid = $1;
			`,
			values: [studentid]
		}
		const res = await client.query(query);
		return res.rows;
	}

	async fetchProjectDetails(projectid) {
		const query = {
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

	con

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

	async requestToPartakeinProject(projectid, studentid) {
		const query = {
			text:`
				insert into "ProjectStudent" (projectid, studentid) values ($1, $2);
			`,
			values : [projectid, studentid]
		}
		console.log(query);
		const res = await client.query(query);
		return res.rows;
	}
}

module.exports = Project;
