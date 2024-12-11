const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CoffeeLog = require('../models/coffeelog.js');
const { decode } = require('jsonwebtoken');
const router = express.Router();

// ================== Public Routes =======================

// ================== Protected Routes ====================
router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        switch (req.body.category) {
            case 'Coffee Beans':
                if (!req.body.location || !req.body.description) {
                    return res.status(400).json({ message: 'Location and description are required for Coffee Beans.' });
                }
                req.body.coffeeBeans = { location: req.body.location, description: req.body.description };
                break;
            case 'Coffee Shops':
                if (!req.body.shopname || !req.body.pricerange || !req.body.address || !req.body.description) {
                    return res.status(400).json({ message: 'Shop name, price range, address and description are required.' });
                }
                req.body.coffeeShops = {
                    shopname: req.body.shopname,
                    pricerange: req.body.pricerange,
                    address: req.body.address,
                    description: req.body.description
                };
                break;
            case 'Coffee Recipes':
                if (!req.body.title || !req.body.ingredients || !req.body.type) {
                    return res.status(400).json({ message: 'Title, ingredients and type are required for Coffee Recipes.' });
                }
                req.body.coffeeRecipes = { title: req.body.title, ingredients: req.body.ingredients, type: req.body.type };
                break;
            default:
                return res.status(400).json({ message: 'Invalid category' });
        }
        const coffeeLog = await CoffeeLog.create(req.body);
        coffeeLog._doc.author = req.user;
        res.status(200).json(coffeeLog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const coffeeLogs = await CoffeeLog.find({})
            .populate('author')
            .populate('notes.author')
            .sort({ createdAt: 'desc' });

        res.status(200).json(coffeeLogs);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});


router.get('/:coffeelogId', async (req, res) => {
    try {
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId).populate(['author', 'notes.author']);
        res.status(200).json(coffeeLog);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.put('/:coffeelogId', async (req, res) => {
    try {
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);
        if (!coffeeLog.author.equals(req.user._id)) {
            return res.status(403).send("You don't have access to do that.");
        }

        // Handle category-specific fields
        switch (req.body.category) {
            case 'Coffee Beans':
                req.body.coffeeBeans = { location: req.body.location, description: req.body.description };
                break;
            case 'Coffee Shops':
                req.body.coffeeShops = {
                    shopname: req.body.shopname,
                    pricerange: req.body.pricerange,
                    address: req.body.address,
                    description: req.body.description
                };
                break;
            case 'Coffee Recipes':
                req.body.coffeeRecipes = { title: req.body.title, ingredients: req.body.ingredients, type: req.body.type };
                break;
        }

        const updatedCoffeeLog = await CoffeeLog.findByIdAndUpdate(
            req.params.coffeelogId,
            req.body,
            { new: true }
        ).populate('author');

        res.status(200).json(updatedCoffeeLog);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.delete('/:coffeelogId', async (req, res) => {
    try {
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);
        if (!coffeeLog.author.equals(req.user._id)) {
            return res.status(403).send("You don't have access to do this.");
        }
        const deletedCoffeeLog = await CoffeeLog.findByIdAndDelete(req.params.coffeelogId);
        res.status(200).json(deletedCoffeeLog);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.post('/:coffeelogId/notes', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const coffeeLog = await CoffeeLog.findById(req.params.coffeelogId);
        coffeeLog.notes.push(req.body);
        await coffeeLog.save();

        const newNote = coffeeLog.notes[coffeeLog.notes.length - 1];
        newNote._doc.author = req.user;

        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = router;