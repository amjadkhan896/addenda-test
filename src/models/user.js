const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const Contact      = require('./contact')
const UserSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value < 0){
                throw new Error('Name field is required')
            }
        }
    },
    phone:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value < 0){
                throw new Error('Phone field is required')
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 6,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

UserSchema.virtual('contacts', {
    ref: 'Contact',
    localField: '_id',
    foreignField: 'author'
})




UserSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login 2')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login 2')
    }

    return user
}

UserSchema.methods.newAuthToken = async function(){
    const user  = this
    //console.log(process.env.JWT_SECRET);
    const token =  jwt.sign({ _id: user.id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    //console.log(user)
    await user.save();

    return token
}



//hash the plain text password before saving
UserSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.pre('remove', async function(next){
    const user = this
    await Post.deleteMany({author: user._id})
    next()
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

