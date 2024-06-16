const client = require('./connectDB');

async function getUsers(offset, limit) {
    const query = {
        text: `select userid from "User"
        offset $1 limit $2;`,
        values: [offset, limit]
    }
    const users = await client.query(query);
    return users.rows;
}

async function addPoints(userid, points, red, yellow, black) {
    const query = {
        text: `
            update "User"
            set shamepoints = shamepoints + $2, redtasks = redtasks + $3, yellowtasks = yellowtasks + $4, pastduetasks = pastduetasks + $5
            where userid = $1
        `,
        values: [userid, points, red, yellow, black]
    }
    await client.query(query);
}

async function cronTaskJob(userid) {
    const query = {
        text: `
            select "TaskUser".taskid, yellowzone, redzone, duedate, isyellowshamed, isredshamed, isblackshamed
            from "Task"
            join "TaskUser" on "Task".taskid = "TaskUser".taskid
            where "TaskUser".userid = $1 and "TaskUser".submissionstatus = false
        `,
        values: [userid]
    }
    const tasks = await client.query(query);
    return tasks.rows;
}

async function markShame(taskid, target, markboolean) {
    const query = {
        text: `
            update "TaskUser"
            set ${target} = $2
            where taskid = $1
        `,
        values: [taskid, markboolean]
    }
    console.log(query);
    await client.query(query);
}

async function calculateShame(offset, limit, timetorecheck = false) {
    try {
        let changesWasMade = false;
        let usercount;
        if(timetorecheck) {
            usercount = await client.query('select count(userid) from "User"');
        }
        const users = await getUsers(offset, limit);
        for(const user of users) {
            const tasks = await cronTaskJob(user.userid);
            let shame = 0;
            let black = 0;
            let red = 0;
            let yellow = 0;
            for(const task of tasks) {
                const taskid = task.taskid;
                const isyellowshamed = task.isyellowshamed;
                const isredshamed = task.isredshamed;
                const isblackshamed = task.isblackshamed;
                const yellowzone = new Date(task.yellowzone);
                const redzone = new Date(task.redzone);
                const duedate = new Date(task.duedate);
                const today = new Date();
                if(today > duedate && !isblackshamed) {
                    shame += 5;
                    black++;
                    markShame(taskid, 'isblackshamed', true);
                    changesWasMade = true;
                } else if(today > redzone && !isredshamed) {
                    shame += 3;
                    red++;
                    markShame(taskid, 'isredshamed', true);
                    changesWasMade = true;
                } else if(today > yellowzone && !isyellowshamed) {
                    shame += 1;
                    yellow++;
                    markShame(taskid, 'isyellowshamed', true);
                    changesWasMade = true;
                }
            }
            await addPoints(user.userid, shame, red, yellow, black);
        }
        return usercount !== undefined ? {rowCount: usercount.rows[0].count, changes: changesWasMade} : {rowCount: undefined, changes: changesWasMade};
    } catch(err) {
        console.log(err);
    }
}

module.exports = calculateShame;