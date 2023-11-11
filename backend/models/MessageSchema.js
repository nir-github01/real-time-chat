import mongoose from "mongoose";


let messageSchema = new mongoose.Schema({
      conversationId:{
        type:String
      },
      senderId:{
        type:String,
      },
      recieverId:{
        type:String,
      },
      message:{
        type:String,
      },
}, {timestamps:true});

let usersMessages = mongoose.model('userMessage', messageSchema);

export default usersMessages;