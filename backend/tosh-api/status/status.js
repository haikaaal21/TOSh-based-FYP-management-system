const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const status = {
        message: 'Server is up and running!',
        timestamp: new Date()
    };
    res.json(status);
});

module.exports = router;
