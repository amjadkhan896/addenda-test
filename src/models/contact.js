const mongoose = require('mongoose');

const ContactSchema  = new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required:true,
        trim: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});



const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact