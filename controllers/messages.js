const { getSocketId, io } = require("../socket/socket");
const {Conversesation, Message}= require('../modals/modals')

const sendMessage=async(req,res)=>{
const {reciepentId,convId,text}=req.body;
const userId=req.userId;


let converse= await Conversesation.findOne({participants:{$all:[userId,reciepentId]}});
if(!converse){
  converse= await Conversesation.create({participants:[userId,reciepentId],sender:{senderId:userId},lastmessage:text,seen:false});
}else{
   converse.updateOne({lastmessage:text,seen:false});
   await converse.save();
};

const message=await Message.create({text,recieverId:reciepentId,senderId:userId,conversesationId:converse._id,to:{}});
const socketId=getSocketId(reciepentId);
if(socketId){
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



module.exports={sendMessage,getConversesations};