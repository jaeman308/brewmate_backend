
const mongoose = require('mongoose');

const coffeeBeanSchema = new mongoose.Schema({
    title: {
        type: String, 
        reqquired: true,
    }, 
    location: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },

});


const coffeeShopSchema = new mongoose.Schema({
    title: {
        type: String, 
        reqquired: true,
    }, 
    shopname: {
        type: String,
        required: true,
    },
    pricerange: {
        type: String, 
        required: true, 
        enum: ['$', '$$', '$$$', '$$$$', '$$$$$'],
    },
    address: {
        type: String,
        required: true,
    },
    description: { 
        type: String, 
        required: true,
    },
});

const coffeeRecipesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        required: true, 
    },
    type: {
        type: String,
        required: true,
        enum: ['Espresso', 'Americano', 'Cappuccino', 'Latte',
            'Mocha', 'Flat White', 'Cold Brew', 'Iced Coffee', 'Cartado',
            'Affogato', 'Nitro Coffee', 'Drip Coffee', 'Pour-over', 'French Press', 
            'Cafe au Lait'
        ],
    },

});

const notesSchema = new mongoose.Schema(
    {
    text: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
)

const coffeeLogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String, 
            required: true,
            enum: ['Coffee Beans', 'Coffee Shops', 'Coffee Recipes'],
        },
        coffeeBeans: {
            type: coffeeBeanSchema,
            default: null,
        },
        coffeeShops: {
            type: coffeeShopSchema,
            default: null,
        },
        coffeeRecipes: {
            type: coffeeRecipesSchema,
            default: null,
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: [notesSchema],
    },
    { timestamps: true }
);


const CoffeeLog = mongoose.model('CoffeeLog', coffeeLogSchema);

module.exports = CoffeeLog;
