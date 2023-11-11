import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB  from './config/dbconnection.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import {Server} from 'socket.io';


import usersRoutes from './routes/userRoutes.js';
import usersModel from './models/userModels.js';

const app = express();
const port = process.env.PORT || 8000;
const mongodburl = process.env.MONGODB_URL;

const io = new Server()
io.listen(8080, {
   cors:{
      origins:["http://localhost:3000"],
      origins:["http://localhost:3001"]
    
   }
});

//Socket 
let users =[];
io.on("connection", (socket) => {
   console.log(`socket ${socket.id} connected`);
   //  socket.emit("getUsers", usersModel);

    socket.on("addUser", async(userId) => {
       let isUserExist = users.find(user=> user.userId ===userId)
      //  console.log(isUserExist)
       if(!isUserExist){
         const user = {userId, socketId:socket.id};
         // console.log( user)
         users.push(user)
         io.emit('getUsers', users)
       }
    });
    socket.on("sendMessages", async({senderId, conversationId, recieverId, message})=>{
     try{
      let reciever = users.find(user=> user.userId === recieverId);
      let sender = users.find(user=> user.userId === senderId);

      let today = new Date();
      let date = today.getFullYear() +" / "+today.getMonth()+" / "+today.getDate();
      let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();

      let userdata = await usersModel.findById(senderId);
      let user = {
            userId:userdata._id,
            fullName:userdata.fullName, 
            email:userdata.email, 
            phone:userdata.phone, 
            age:userdata.age, 
            gender:userdata.gender
         }
      if(reciever){
         io.to(reciever.socketId).to(sender.socketId).emit('getMessages', {
            senderId,
            recieverId,
            conversationId,
            message,
            user,
            date,
            time
         })
      }else{
         io.to(sender.socketId).emit('getMessages', {
            senderId,
            recieverId,
            conversationId,
            message,
            user,
            date,
            time
         })
      }
   }catch(error){
      console.log(error)
   }
   })
    //upon disconnection
    socket.on("disconnect", (reason) => {
       users = users.filter(user=> user.socketId !== socket.id);
      io.emit('getUsers', users)
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
   
 });

//database connection 
 connectDB(mongodburl);

 //cors 
 app.use(cors());
 
 //json 
 app.use(express.json());
 app.use(express.json({extended:false}))
 app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

 //Body parser

//  app.use(express.json(bodyParser));

 /**Router */
app.use('/api/user', usersRoutes);

app.listen(port , (req, res) => {
   console.log(`server is running on this http://localhost:${port}`)
})