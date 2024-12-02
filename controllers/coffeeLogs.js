const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CoffeeLog = require('../models/coffeelog.js');
const router = express.Router();

// ================== Public Routes =======================

// ================== Protected Routes ====================
router.use(verifyToken); 

router.post('/', async (req, res) => {
    try{
        req.body.author = req.user._id
        const coffeelog = await CoffeeLog.create(req.body);
        coffeelog._doc.author = req.user;
        // console.log(coffeelog._doc)
        res.status(200).json(coffeelog)

    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

})

module.exports = router;