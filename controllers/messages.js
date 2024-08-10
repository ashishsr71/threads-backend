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


module.exports={sendMessage};