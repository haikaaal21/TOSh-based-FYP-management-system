const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.status(404).json({ message: '404: Not Found' });
})

module.exports = router;
