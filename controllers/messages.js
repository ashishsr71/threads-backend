const { getSocketId, io } = require("../socket/socket");
const {Conversesation, Message}= require('../modals/modals');
// const { produceMessage } = require("../kafkaconfig/kafka");

const sendMessage=async(req,res)=>{
const {reciepentId,text}=req.body;
const userId=req.userId;
// const msg={senderId:userId,reciepentId,text:text||"",}

let converse= await Conversesation.findOne({participants:{$all:[userId,reciepentId]}});
if(!converse){
  converse= await Conversesation.create({participants:[userId,reciepentId],lastmessage:{text,seen:false,sender:{reciepentId,senderId:userId}}});
}else{
   converse.updateOne({lastmessage:{text,seen:false,sender:{reciepentId,senderId:userId}}});
   await converse.save();
};

const message=await Message.create({text,recieverId:reciepentId,senderId:userId,conversesationId:converse._id,to:{},seen:false});
const socketId=getSocketId(reciepentId);
// console.log(socketId)
if(socketId){
  // console.log(' iam working')
  conosole.log(socketId,message)
    io.to(socketId).emit('message',message);
};
// await produceMessage(JSON.stringify(msg));
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
  const {id}=req.params;
  
  try {
  await Conversesation.updateOne({_id:id},{
      $set:{
        "lastmessage.seen":true
      }
    });
    await Message.updateMany({conversesationId:id,seen:false,recieverId:userId},{
      $set:{seen:true}
    });

    const conversesation=await Message.find({conversesationId:id}).sort({createdAt:-1}).limit(15).exec();
    const reciepentId= userId!=conversesation[0]?.recieverId?conversesation[0]?.recieverId:conversesation[0]?.senderId;
    const socketId=getSocketId(reciepentId);
    // console.log(userId==reciepentId)
    // console.log("this is " + reciepentId)
    // console.log(socketId)
    if(socketId){
      io.to(socketId).emit('seen',conversesation);
      // console.log("emitted")
    }

    const realConvo=conversesation.reverse();
    res.status(200).json(realConvo);
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:'internal server error'});
  }
};
// include this feature in messages
const unsendMessage=async(req,res)=>{
  const {userId}=req;
  const {messageId,conversesationId}=req.body;
  const message=await Message.findOne({_id:messageId});
  if(message.senderId==userId){
    await Message.deleteOne({_id:messageId});
    return res.status(201).json({msg:"message deleted"});
  };
  res.status(401).json({msg:"unauthorised"})
};

const seenMessage=async(req,res)=>{
  const userId=-req.userId;
  const {conversesationId}=req.body;
// await Conversesation.findOneAndUpdate()

}


const messageSeen=async(req,res)=>{
  // const messageId=req.params.messageId;
  const userId=req.userId;
  const {messageId}=req.body;

if(!messageId){
  return res.status(400).json({msg:"bad request"});
}

const message=await Message.findOneAndUpdate({_id:messageId,recieverId:userId},{
  $set:{seen:true}
});
// console.log(message)
const socketId=getSocketId(message.senderId);
if(socketId){
  // console.log(socketId)
  // console.log(userId==message.senderId)
  io.to(socketId).emit('sone',message);
}


res.status(200).json({msg:"seen"})



  
  
 



}

// const seenSingleMessage=async(req,res)=>{
//   const {messageId}=req.body;
//   if(!messageId)
// }

module.exports={sendMessage,getConversesations,getSingleConversesation,messageSeen};
