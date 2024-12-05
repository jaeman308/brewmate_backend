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
        const coffeeLog = await CoffeeLog.create(req.body);
        coffeeLog._doc.author = req.user;
        // console.log(coffeelog._doc)
        res.status(200).json(coffeeLog)

    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}); 

router.get('/', async (req, res) => {
    try{
        const { category } = req.query;
        let coffeeLogs;
        if (category) {
            coffeeLogs = await CoffeeLog.find({'category': category})
            .populate('author')
            .sort({createdAT: 'desc'});
        } else {
            coffeeLogs = await CoffeeLog.find({})
            .populate('author')
            .sort({createdAt: 'desc'})
        }
        res.status(200).json(coffeeLogs);
    }catch (error) {
        res.status(500).json(error)
    }
});

router.get('/:coffeeLogId', async (req, res) => {
    try {
        const coffeeLog = await CoffeeLog.findById(req.params.coffeeLogId).populate(['author', 'notes.author']);
        res.status(200).json(coffeeLog);
    }catch (error) {
        res.status(500).json(error)
    }
});

router.put('/:coffeelogId', async (req, res) => {
    try {
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);
        if(!coffeeLog.author.equals(req.user._id)) {
            return res.status(403).send("You don't have access to do that.")
        }
        const updatedCoffeeLog = await CoffeeLog.findByIdAndUpdate(
            req.params.coffeelogId,
            req.body,
            {new: true}
        );
        updatedCoffeeLog._doc.author = req.user;
        res.status(200).json(updatedCoffeeLog)
    
    }catch (error) {
        res.status(500).json(error)

    }
});

router.delete('/:coffeelogId', async (req,res) => {
    try{
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);

        if(!coffeeLog.author.equals(req.user._id)) {
            return res.status(403).send("You don't have access to do this.")
        }
    const deletedCoffeeLog = await CoffeeLog.findByIdAndDelete(req.params.coffeelogId);
    res.status(200).json(deletedCoffeeLog);

    }catch(error) {
        res.status(500).json(error)
    }
});

router.post('/:coffeelogId/notes', async (req, res) => {
    try{
        req.body.author = req.user._id;
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);
        coffeeLog.notes.push(req.body);
        await coffeeLog.save();

        const newNote = coffeeLog.notes[coffeeLog.notes.length -1];

        newNote._doc.author = req.user;
        
        res.status(201).json

    }catch (error) {
        res.status(500).json(error)
    }
});




module.exports = router;