const express = require('express');
const router = express.Router();
const Item = require('../model/itemModel');

const item = new Item();

router.get('/:userid', async(req,res) => {
    const limit = 35;
    const offset = 0;
    const userid = req.params.userid;
    try{
        const result = await item.fetchAll(userid, limit, offset);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in Fetching Items:', error);
        res.status(500).json({message: 'Error in Fetching Items!'});
    }
})

module.exports = router;