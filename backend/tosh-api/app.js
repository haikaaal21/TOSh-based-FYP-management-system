const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(router);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
})

router.get('/', (req, res) => getStatus(res));

function getStatus(res) {
    res.send("Server is running on port: " + port);
}

