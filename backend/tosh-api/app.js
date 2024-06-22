const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const port = process.env.port || 4000;

var cron = require('node-cron');

var notFound = require('./routes/404');
var taskRoute = require('./routes/Task');
var eventRoute = require('./routes/Event');
var projectRoute = require('./routes/Project');
var itemsRoute = require('./routes/items');
var UserRoute = require('./routes/User');
var fetchUnis = require('./routes/university/fetchUniversities');
var ComplaintRoute = require('./routes/Complaint');
var BatchRoute = require('./routes/Batch');

const Websocket = require('ws');
const notifyUsers = require('./middleware/notifyUsers');

const { sendMail } = require('./middleware/SendMail');
const calculateShame = require('./CalculateShame');
const wss = new Websocket.Server({port : 8080});

app.use('/api/university/fetch', fetchUnis);
app.use('/api/task', taskRoute); 
app.use('/api/event', eventRoute);
app.use('/api/project', projectRoute);
app.use('/api/items', itemsRoute);
app.use('/api/user', UserRoute);
app.use('/api/complaint', ComplaintRoute);
app.use('/api/batch', BatchRoute);
app.use('/api/assets', express.static('./public'));

const client = require('./connectDB');

router.post('/thekalzone', async(req,res) => {
    const gformlink = req.body.gform;
    const key = req.body.kalk3y;
    if(key !== process.env.THE_KAL_KEY) {
        return res.status(401).json({message: 'Unauthorized!'});
    } else {
        try {
            const emails = await client.query('update "BetaTester" set sentlink = true where sentlink = false returning email');
            let emailList = emails.rows.map((email) => email.email);
            const emailobj = {
                to: emailList,
                subject: 'User Acceptance review for SPARES!',
                image: 'remind.png',
                name: 'Beta Tester!',
                body: `
                    We've got a new form we'd love for you to fill out. Your feedback is incredibly valuable and will help us make SPARES even better, thank you for your support on trying SPARES.
                    Please click the link below to fill out the form:
                    ${gformlink}
                `,
            }
            await sendMail(emailobj.to, emailobj.subject, emailobj.image, emailobj.name, emailobj.body);
        } catch (error) {
            console.error('Error in Sending Mail:', error);
            res.status(500).json({message: 'Error in Sending Mail!'});
        }
    }
})

app.use('*', notFound);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

let clients = []; //? Websocket Client Length

//? Websocket Functions
wss.on('connection', (ws) => {
    if(clients.length > 100) {
        ws.close(1001, "Server at it's maximum capacity!");
    } else {
        clients.push(ws);
    }
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if(data.payload === 'fetch-me-vanilla') {
            pushUpdatesToClients();
        } else {
            pushUpdatesToClients(data.institution, ws)
        }
    });

    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws);
    });

    ws.send('Connected to SPARES!');
});

var userModel = require('./model/userModel');

const user = new userModel();

let offset = 0;
let limit = 10;

async function pushUpdatesToClients(institution = null, target = null) {
    let itemsToBeSent = await user.socketFetch();
    for (const client of clients) {
        if (client.readyState === Websocket.OPEN) {
            if(client === target) {
                itemsToBeSent = await user.socketFetch(institution);
            }
            client.send(JSON.stringify(itemsToBeSent, null));
        }
    }
}

async function shame() {
    let changes = false;
    let totalrow;
    if(offset % 50 === 0) {
        const result = await calculateShame(offset, limit, true);
        totalrow = result.rowCount;
        changes = result.changes;
    } else{
        const result = await calculateShame(offset, limit);
        changes = result.changes;
    }
    offset = totalrow < offset ? 0 : offset + limit;
    if(changes) {
        await pushUpdatesToClients();
    }
}

function notify() {
    notifyUsers();
    console.log('Notified Users @ ' + new Date());
}

cron.schedule('0 */6 * * *', notify);

setInterval(() => {
    shame();
}, 1500);

