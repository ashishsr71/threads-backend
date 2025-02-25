const SSE=require("express-sse");
const { Follow, Rooms } = require("../modals/modals");



const sseStreams=new Map();

async function sendToFollowers(req,res){
    res.flush = () => {}; 
    const userId=req.userId;
    console.log(userId)
    if(!sseStreams.has(userId)){
      sseStreams.set(userId,new SSE());
    };
    
    sseStreams.get(userId).init(req,res);
    const interval = setInterval(() => {
        sseStreams.get(userId).send({ type: "heartbeat", message: "ping" });
    }, 30000);
  
    req.on('close',()=>{
        console.log(`connection closed for userId ${userId}`)
        clearInterval(interval)
    })
    
    };

async function sendEvent(userId,roomInfo){

const userData=await Follow.findOne({userId});
const requiredArray=userData.followers.map(id=>id.toString())


requiredArray.forEach(follower => {
    if(sseStreams.has(follower)){
        sseStreams.get(follower).send({...roomInfo._doc});
    };
});

};
async function fetchConferences(id){
const uData=await Follow.findOne({userId:id});
const rooms=await Rooms.find({createdBy:{$in:uData.following},isActive:true});
return rooms;
}

    module.exports={sendToFollowers,sendEvent,fetchConferences};