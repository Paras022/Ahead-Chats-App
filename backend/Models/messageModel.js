const mongoose = require("mongoose");

const messageModel = mongoose.Schema({
    //  sender of the message
    sender :{ type:mongoose.Schema.Types.ObjectId, ref :"User"},
    // content of the message
    content:{type:String , trim:true},
    // chat  is where the message belong 
    chat:{ type:mongoose.Schema.Types.ObjectId, ref :"Chat"},
},{
    timestamp:true,
}

);

const Message = mongoose.model("Message" ,messageModel);
module.exports = Message;