const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(router);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
})

router.get('/', (req, res) => {
    res.send("Hello World");
});