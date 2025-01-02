const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    friends:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    friendRequests: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    profession:{
        type: String,
    },
    location:{
        type:String,
    },
    phone:{
        type: String,
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;