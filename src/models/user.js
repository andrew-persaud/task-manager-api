const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task.js');

//model schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email : {
        type: String,
        required : true,
        trim : true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        },
        unique: true
    },
    password : {
        type: String,
        required : true,
        minlength : 7,
        validate(value) {
            if (value === 'password') {
                throw new Error('Password must not be "password"');
            }
        },
        trim : true,
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],
    avatar : {
        type: Buffer
    }
}, {
    timestamps: true
});

//Virtual property to state how things are related.
//User _id is related to the owner field on a task.
//Use populate() and execPopulate()

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
});

//Hide private data by using toJSON

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//Generate web tokens
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

//Setup login authentication

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

//Hash password
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner : user._id});
    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;