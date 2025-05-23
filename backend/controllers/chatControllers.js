const asyncHandler = require("express-async-handler");
const Chat = require('../Models/chatModel');
const User = require("../Models/userModel");

const accessChat = asyncHandler(async(req, res)=>{
  const {userId } =  req.body;

  if(!userId){
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
      users: { $all: [req.user._id, userId] },
        
  }).populate("users","-password").populate("latestMessage");

  isChat = await User.populate(isChat ,{
    path:'latestMessage.sender',
    select:"name pic email",
  });

  if(isChat.length > 0){
    res.send(isChat[0]);
  }else{
    var chatData = {
        chatName:"sender",
        isGroupChat: false,
        users:[req.user._id , userId],
    };

    try{
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({_id:createdChat._id}).populate(
            "users",
            "-password"
        );
        res.status(200).send(FullChat);
    }catch(error){
            res.status(400);
            throw new Error(error.message);
    }
  }

});

const fetchChats = asyncHandler(async (req, res) => {
    try {
      let chats = await Chat.find({ users: req.user._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
  
      chats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
  
      res.status(200).json(chats);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  

module.exports = {accessChat , fetchChats};