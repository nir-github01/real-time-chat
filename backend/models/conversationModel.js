import mongoose from "mongoose";


let conversationSchema = new mongoose.Schema({
    members:{
      type:Array,
      required:true
    }
},   {timestamps:true},);

let ConvoModel = mongoose.model('userConvo', conversationSchema);

export default ConvoModel;