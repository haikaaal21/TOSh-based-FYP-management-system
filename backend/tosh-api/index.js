const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.port || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", port);
})
