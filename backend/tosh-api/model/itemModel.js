const eventModel = require('./eventModel');
const taskModel = require('./taskModel');

class Item {
	async fetchAll(userid, limit, offset) {
		const Task = new taskModel();
		const Event = new eventModel();
		const task = await Task.fetchTaskByUserId(userid, limit, offset, true);
		const event = await Event.fetchEvents(userid, limit, offset, true);

		const combined = [...task, ...event];
		combined.sort((a, b) => {
			const dateA = new Date(a.duedate || a.eventdate);
			const dateB = new Date(b.duedate || b.eventdate);
			
			return dateA - dateB;
		});

		const structuredCombined = combined.map(item => ({
			typeOfItem: item.taskid ? 'task' : 'event',
			itemid: item.taskid || item.eventid,
			title: item.tasktitle || item.eventtitle,
			dateFrom: item.name || item.eventhead, 
			dueDate: item.duedate || item.eventdate,
			coordinatorDesignated: item.iscoordinator
		}))

		return structuredCombined;
	}

	//! Experimental!
	async fetchAllByMonth(userid, month) {
		const Task = new taskModel();
		const Event = new eventModel();
		const task = await Task.fetchTaskByMonth(userid, month);
		const event = await Event.fetchEventsByMonth(userid, month);

		const combined = [...task, ...event];
		combined.sort((a, b) => {
			const dateA = new Date(a.duedate || a.eventdate);
			const dateB = new Date(b.duedate || b.eventdate);
			
			return dateA - dateB;
		});

		const structuredCombined = combined.map(item => ({
			typeOfItem: item.taskid ? 'task' : 'event',
			itemid: item.taskid || item.eventid,
			title: item.tasktitle || item.eventtitle,
			dateFrom: item.name || item.eventhead, 
			dueDate: item.duedate || item.eventdate,
			coordinatorDesignated: item.iscoordinator
		}))

		return structuredCombined;
	}
}

module.exports = Item;
