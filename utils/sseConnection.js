const SSE=require("express-sse");
const { Follow } = require("../modals/modals");



const sseStreams=new Map();

async function sendToFollowers(req,res){
    res.flush = () => {}; 
    const userId=req.userId;
    console.log(userId)
    if(!sseStreams.has(userId)){
      sseStreams.set(userId,new SSE());
    };
    
    sseStreams.get(userId).init(req,res);
    
  
    req.on('close',()=>{
        console.log(`connection closed for userId ${userId}`)
        // clearInterval(intervalId)
    })
    
    };

async function sendEvent(userId,roomInfo){

const userData=await Follow.findOne({userId});


userData?.followers.forEach(follower => {
    if(sseStreams.has(follower)){
        sseStreams.get(follower).send({conference:roomInfo})
    }
});

};


    module.exports={sendToFollowers,sendEvent};