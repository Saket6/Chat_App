const mongoose=require('mongoose');


const Schema=new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
            
    },
    message:{
        type: String,
    },
    file:{
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Message=mongoose.model('messages',Schema);

module.exports=Message;