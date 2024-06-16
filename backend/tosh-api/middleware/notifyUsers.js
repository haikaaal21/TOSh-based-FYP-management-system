const client = require('../connectDB');
const {sendMail} = require('./SendMail');

async function notifyStudent() {
    const query = {
        text: `
        SELECT *
        FROM (
        SELECT "User".name, "User".email,
            (SELECT COUNT(*) FROM "TaskUser" WHERE "TaskUser".userid = "User".userid AND "TaskUser".isyellowshamed) AS yellowcount,
            (SELECT COUNT(*) FROM "TaskUser" WHERE "TaskUser".userid = "User".userid AND "TaskUser".isredshamed) AS redcount,
            (SELECT COUNT(*) FROM "TaskUser" WHERE "TaskUser".userid = "User".userid AND "TaskUser".isblackshamed) AS blackcount
        FROM "User"
        WHERE "User".userid IN (SELECT userid FROM "TaskUser")
        ) AS derived_table
        WHERE yellowcount > 0 OR redcount > 0 OR blackcount > 0        `
    }
    try {
        const res = await client.query(query);
        const users = res.rows;
        for(const user of users) {
            const mailObj = {
                to : user.email,
                subject : 'Shame Notification',
                image: 'overdue.png',
                name: user.name,
                body: `
                    You've been caught with some unfinished tasks, and it's time to chase them before the deadline!
                    In the Yellow Zone: ${user.yellowcount} tasks
                    In the Red Zone: ${user.redcount} tasks
                    Overdue: ${user.blackcount} tasks
                    Please submit the tasks as soon as possible.
                    `
            }
            await sendMail(mailObj.to, mailObj.subject, mailObj.image, mailObj.name, mailObj.body);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } catch(error) {
        console.error('Error in Notifying Students:', error);
    }
}

module.exports = notifyStudent;