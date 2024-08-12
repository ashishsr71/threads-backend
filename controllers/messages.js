const { getSocketId, io } = require("../socket/socket");
const {Conversesation, Message}= require('../modals/modals')

const sendMessage=async(req,res)=>{
const {reciepentId,text}=req.body;
const userId=req.userId;


let converse= await Conversesation.findOne({participants:{$all:[userId,reciepentId]}});
if(!converse){
  converse= await Conversesation.create({participants:[userId,reciepentId],lastmessage:{text,seen:false,sender:{reciepentId,senderId:userId}}});
}else{
   converse.updateOne({lastmessage:{text,seen:false,sender:{reciepentId,senderId:userId}}});
   await converse.save();
};

const message=await Message.create({text,recieverId:reciepentId,senderId:userId,conversesationId:converse._id,to:{}});
const socketId=getSocketId(reciepentId);
// console.log(socketId)
if(socketId){
  // console.log(' iam working')
    io.to(socketId).emit('message',message);
};

res.status(200).json(message);


};

const getConversesations=async(req,res)=>{
const userId=req.userId;

try {
  const conversesations= await Conversesation.find({participants:{$in:[userId]}}).populate({path:'participants',select:'username userImg'});
  res.status(200).json(conversesations);
} catch (error) {
  res.status(500).json({msg:"internal server error"})
}
};


const getSingleConversesation=async(req,res)=>{
  const userId= req.userId;
  const id=req.params.id;
  try {
    const conversesation=await Message.find({conversesationId:id});
    res.status(200).json(conversesation);
  } catch (error) {
    res.status(500).json({msg:'internal server error'});
  }
}



module.exports={sendMessage,getConversesations,getSingleConversesation};