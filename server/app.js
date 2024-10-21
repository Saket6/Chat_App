const express=require('express');
const app=express();
const conn=require('./db/conn');
const Router=require('./Router/Routes')
var cors = require('cors')
const socket=require('socket.io');
const bodyparser=require('body-parser');
const cookieparser=require('cookie-parser');
conn();

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(Router);
require('dotenv').config()

app.use(express.json());


app.get('/',(req,res)=>
{
    res.send("Hello from server")
})

const server=app.listen(process.env.PORT,()=>
{
    console.log(`listening on port ${process.env.PORT}`)
})

const io=socket(server,{
    cors:{
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

global.onlineUsers=new Map();

io.on('connection',(socket)=>
{
    console.log("connected to socket")
    global.chatSocket=socket;
    socket.on("addUser",(userId)=>
    {
        onlineUsers.set(userId,socket.id);
        console.log("user added to room: ",onlineUsers);
    });

    socket.on("send",(data)=>
    {
        const sendUserSocket=onlineUsers.get(data.to);
        // console.log(data);
        // console.log('send user socket',sendUserSocket);
        if(sendUserSocket)
        {
            console.log("sendUserSocket reached");
            socket.to(sendUserSocket).emit("message-recieve",data.msg);
            console.log("reached end");
        }
    })
});


