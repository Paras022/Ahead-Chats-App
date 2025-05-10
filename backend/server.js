const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require("./Routes/chatRoutes")
const messageRoutes = require("./Routes/messageRoutes")

const connectDB = require('./Config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewarre');

connectDB();

const app = express();
// to accept the json data from the frontend
app.use(express.json()); 
const cors = require('cors');
app.use(cors());


app.get('/chats', (req, res) => {
  res.send("home api running");
});

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)


app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 8000;
const server =  app.listen(PORT, () => console.log(`server has started on PORT ${PORT}`));



const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"https://ahead-chats-app.onrender.com"  //"http://localhost:5173",
  },
});

const onlineUsers = new Map(); 

io.on("connection" ,(socket)=>{

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`${user.name} joined ${socket.id}`)
    onlineUsers.set(userData._id, socket.id); 
    io.emit("get-online-users", Array.from(onlineUsers.keys())); 
    socket.emit("connected");
  });
  
  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log(onlineUsers.keys());
    io.emit("get-online-users", Array.from(onlineUsers.keys())); 
  });
  


  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user joined room :" + room);
  });

  socket.on('typing',(room)=>socket.in(room).emit("typing"));
  socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));


  socket.on('new message',(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;
    if(!chat.users) return console.log("chat users not defined");

    chat.users.forEach(user =>{
      if(user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message receieved" , newMessageRecieved)
    })
  })

  socket.on("new-chat-created", ({ chat, to }) => {
    const socketId = onlineUsers.get(to);
    if (socketId) {
      socket.to(socketId).emit("chat-received", chat);
    }
  });

  
  socket.off("setup" ,() =>{
    console.log("user disconnected");
    socket.leave(userData._id);
  })
});
