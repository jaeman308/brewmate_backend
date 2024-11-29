const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique : true,
        required: true,
    }, 
    email: {
        type: String, 
        required: true,
    },
    hashedPassword: {
        type: String, 
        reuired: true,

    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        delete returnedOblect.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);
