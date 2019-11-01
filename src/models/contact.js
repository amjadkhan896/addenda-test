const mongoose = require('mongoose');


const ContactSchema  = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required:true,
        trim: true
    },
    email:{
        type: String,
        required:true,
        trim: true
    },
    address:{
        type: String,
        required:true,
        trim: true
    },
    user_id:{
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