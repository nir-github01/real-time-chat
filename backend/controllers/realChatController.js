import usersModel from '../models/userModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ConvoModel from '../models/conversationModel.js';
import usersMessages from '../models/MessageSchema.js';



class realChatController {

  //User Registration 

  static userRegistartion = async (req, res) => {
    const {fullName, email, gender, age, phone, password, password_confirmation, tc} = req.body;
    if(fullName && email && phone && password && password_confirmation, tc){
        let checkExistUser = await usersModel.findOne({email:email})
        if(checkExistUser){
           res.send({
            "status":"failed",
            "message":"User already exist,  visit login page"
           })
        }else{
              if(password === password_confirmation){
                     let salt = await bcrypt.genSalt(10);
                     let hashPassword = await bcrypt.hash(password, salt);
                      let registerUser = new usersModel({
                        fullName:fullName,
                        email:email,
                        gender:gender,
                        age: age,
                        phone:phone,
                        password:hashPassword,
                        tc:tc
                      })
                try{
                    let userDetails = await registerUser.save();
                    let registeredUser =await usersModel.findOne({email:email});

                    let secretKey = process.env.JWT_SECRET_KEY;
                    let payLoad = {
                      userId:registeredUser._id,
                      email:email
                    }
                    let token = jwt.sign(payLoad, secretKey, {expiresIn:'1d'});
                    console.log(userDetails)
                    res.status(201).send({
                      "status":"success",
                      "messege":"User registered successfully",
                      token:token,
                      userDetails:userDetails
                    })
                }catch(error){
                  res.send({
                    "status":"failed",
                    "messege":"Something went wrong ",
                    "error":error
                  })
                }
              }else{
                res.send({
                  "status":"failed",
                  "messege":"password and confirm password dosenot match"
                })
              }
            }    

    }else{
      res.send({
        "status":'failed',
        "messege":'All fields are required'
      })
    }
  }

  //User LogIn

  static userLogIn = async(req, res) => {
    
    const {email, currentPassword} = req.body;
    if(email && currentPassword){
      try{     
      let checkUser = await usersModel.findOne({email:email});
      if(checkUser){
       const validPassword = await bcrypt.compare(currentPassword, checkUser.password);
          if(validPassword){ 
            let payLoad = {   
                  userId:checkUser._id,
                  email:email,
            }

            let jwtSecretKey =process.env.JWT_SECRET_KEY;
            let token = jwt.sign(payLoad, jwtSecretKey, {expiresIn:'1d'});
            res.status(200).send({
              "status":"success",
              "message":"LogIn Successfully",
              user:checkUser,
              token:token,
            })
          }else{
            res.send({
              "status":"failed",
              "message":"incorrect email or password"
            })
          }
      }else{
        res.send({
          "status":"failed",
          "message":"User not found"
        })
      }
      }catch(error){
        res.send({
          "status":"failed",
          "message":"Something went wrong...... ",
          "errorr":error
        })
      }
    }else{
         res.send({
          "status":"failed",
          "messege":"fill all field correctly",
         })    
    }
  }

  //Conversation 
  static newUserConversation = async(req, res)=> {
    try{

      const {senderId, recieverId} = req.body;
      if(senderId && recieverId ){
        const conversation =new ConvoModel({members:[senderId, recieverId]})

        let convoData=await conversation.save();
      
        res.status(200).send({
          "status":"success",
          "message":"Users conversation created successfully",
          "userConvo":convoData,
        })
      }else{
        res.status(400).json({
          "status":"failed",
          "message":"sender Id  or reciever required"
        })
      }

    }catch(error){
      console.log(error);
    }
  }

  static getUserConversation = async(req, res)=>{
      try{
          const userId = req.params.userId;
            
          const Conversations = await ConvoModel.find({ members : { $in: [userId]}})
            let conversationUsers =Promise.all(Conversations.map(async(conversation)=> {
              let recieverId =await conversation.members.find((member) => member !== userId)
                 if(recieverId){
                    let users = await usersModel.findById(recieverId)
                    if(users){
                        let data = {
                          user:{
                            userId:users._id,
                            fullName:users.fullName, 
                            email:users.email, 
                            phone:users.phone,
                            gender:users.gender,
                            age:users.age
                          },
                          conversationId:conversation._id
                        }
                        return data;
                  }
                }else if(recieverId === null){
                  console.log("deleteUsers")
                }
                console.log(await conversationUsers)
            }))
            res.status(200).send(await conversationUsers)
      }catch(error){
        console.log(error)
      }
      

  }

  static postUsersMessages = async(req, res)=>{
      try{
         const {conversationId, senderId, message, recieverId} = req.body;
        console.log(req.body)
        if(!senderId || !message) return res.status(200).json([]);
        if(conversationId && recieverId && senderId && message){
             const continueMessage = new usersMessages({conversationId, senderId, message, recieverId})
             const messageData = await continueMessage.save();
            //  console.log(messageData);
            return res.status(200).json(messageData) 

        }else if(conversationId === 'new' && recieverId && senderId){
           let newConversation = new ConvoModel({members:[senderId, recieverId]});
            let newConversations = await newConversation.save();
            console.log(newConversations)
            // return res.send(newConversations)
            console.log(req.body)
            if(message){
                const newMessages =new usersMessages({conversationId:newConversation._id, senderId, message, recieverId});
                const messageData = await newMessages.save();
                console.log(messageData)
              return res.status(200).json(messageData)
            }
        }else{
         return res.json({
            "status":"failed",
            "message":"all field required"
          })
        }
      }catch(error){
        console.log(error)
      }
  }

  static getConversationMsg = async(req, res)=>{
    try{
      const conversationId =req.params.conversationId;

      const messages = await usersMessages.find({conversationId});
       const userMessageData =Promise.all(messages.map(async(message) => {
            if(message.conversationId === conversationId){
              const senderId = message.senderId;
                if(senderId){
                      const users =await usersModel.findById(senderId);
                      if(users){
                        // console.log(message)
                        const messagesData = { 
                                user:{
                                  userId:users._id,
                                  fullName:users.fullName,
                                  email:users.email,
                                  phone:users.phone,
                                  gender:users.gender,
                                },
                                messages:message.message,
                                createdTime:message.createdAt,
                                updateTime:message.updatedAt
                                }
                          
                        return  messagesData;
                      }
                }
            }
      }))
      res.status(200).send(await userMessageData)
    }catch(error){
      console.log(error)
    }
  }

  static userDetails = async(req, res) => {
       try{
            let users = await usersModel.find();
            res.send(users)
       } catch(error){
        console.log(error);
       }
  }
}

export default realChatController;