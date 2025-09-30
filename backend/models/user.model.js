const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },
    phone: {
        type: String,
    },
    interviewQues: {
        type: Array,
    },
    interviewAns: {
        type: Array,
    },
    interviewSummary: {
        type: String,
    },
    interviewScore: {
        type: Number,
    }
})


const userModel = mongoose.model('user', userSchema);


module.exports = userModel;