const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    c_password:{
        type: String,
        required: true
    },
    isImageSet:{
        type: Boolean,
        default: false
    },
    AvatarImg:{
        type: String,
        default: ''
    }
})

const User=mongoose.model('Users',UserSchema);

module.exports=User;
