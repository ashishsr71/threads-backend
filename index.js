require('dotenv').config();

const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors');
const mongoose =require('mongoose')
const {Rooms}= require('./modals/modals')
const bodyParser = require('body-parser');
const {auth}= require('./middlewares/auth');
const router=require('./routes/signup');
const loginrouter= require('./routes/userroutes');
const addStoryRouter= require('./routes/storyroutes');
const postRouter= require('./routes/postroutes');
const followRouter= require('./routes/followroute')
const {SearchUser} = require('./controllers/user');
const commentRoute = require('./routes/commentroutes');
const cookieParser=require('cookie-parser');
const messagerouter = require('./routes/messageroutes');
const{server,app}=require('./socket/socket');
const { startMessageConsumer } = require('./kafkaconfig/kafka');
const { sendToFollowers, sendEvent, fetchConferences } = require('./utils/sseConnection');



// initalizing socket server

let AccessToken;
let RoomServiceClient;
let client;
(async () => {
  RoomServiceClient=(await import('livekit-server-sdk')).RoomServiceClient;
  AccessToken = (await import('livekit-server-sdk')).AccessToken;
   client=new RoomServiceClient(process.env.LIVEKIT_URL,process.env.LIVEKIT_API_KEY,process.env.LIVEKIT_API_SECRET);
  
})();

// global midddlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors({
  origin: `${process.env.MODE=="production"?process.env.FRONTEND_PRODUCTION:"http://localhost:5173"}`,
  credentials: true
}));



// configuring clodinary
cloudinary.config({
    cloud_name:process.env.CLOUDE_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    secure:true
});


app.get('/getsignature',auth,async(req,res)=>{

const timestamp= Math.round((new Date).getTime()/1000);
    try {
        const signature= cloudinary.utils.api_sign_request({timestamp},process.env.API_SECRET);
        res.json({timestamp,signature})
    } catch (error) {
        res.status(500).json({error})
    };

});
// api to serach users
app.get('/search',auth,SearchUser);










// user routes
app.use('/user',addStoryRouter);
app.use('/user',router);
app.use('/user',loginrouter);
app.use('/user',postRouter);
app.use('/user',followRouter);
app.use('/user',commentRoute)
app.use('/user',messagerouter)


 
  const createToken = async (username,participantMetadata,roomId) => {
  
    // const roomName = 'quickstart-room';
    
    const participantName = username;
  
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: participantName,
      metadata: participantMetadata,
      ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomId,roomAdmin:true });
    // io.to()
    return await at.toJwt();
  };

  app.post('/getlivetoken',auth, async (req, res) => {
    const metadata=JSON.stringify({role:"host",name:req.username,userId:req.userId});
   const r= await Rooms.create({roomName:req.body.roomName,participants:[{userId:req.userId,
      name:req.username,
      role:"Host",
      imgUrl:""
    }],createdBy:req.userId,isActive:true});
    await sendEvent(req.userId,r)
    // console.log(r._id)
    res.send(await createToken(req.username,metadata,r._id));
  });

  app.post('/getlivetoken/new',auth,async(req,res)=>{
    const {roomId}=req.body;
    const identity=req.username;
    const participantMetadata=JSON.stringify({role:"listener",name:req.username})
   
    try {
      const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity,
       metadata:participantMetadata,
        ttl: '10m',
      });
      at.addGrant({ roomJoin: true, room: roomId,canPublish:false});
      await Rooms.updateOne({_id:roomId},{$push:{participants:{name:req.username,role:"listner",imgUrl:"",
        userId:req.userId
      }}});
      const token= await at.toJwt();
      return res.json(token);
    } catch (error) {
      res.status(500).json({msg:"internal server error"})
    }
  });

  // 
async function unmuteParticipant(roomId, identity) {
  try {
    await client.updateParticipant(roomId, identity, undefined, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
   
  } catch (error) {
    console.error("Error unmuting participant:", error);
  }
};


async function muteParticipant(roomId, identity) {
  try {
    // console.log(roomName,identity)
    await client.updateParticipant(roomId, identity, undefined, {
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });
    
  } catch (error) {
    console.error("Error muting participant:", error);
  }
};

  app.post("/mute",auth, async (req, res) => {
    const {isHost}=req.body;
    if(!isHost)return res.status(401).json({msg:"not authorised"});
    const roomId=req.body.roomId;
    const participantIdentity=req?.body?.participantIdentity;
    await muteParticipant(roomId, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} muted` });
  });
  // route to unmute a participant if you are a host
  app.post("/unmute",auth, async (req, res) => {
      const roomId=req.body.roomId;
      const {isHost}=req.body;
      if(!isHost)return res.status(401).json({msg:"not authorised"});
    const participantIdentity=req?.body?.participantIdentity;
    await unmuteParticipant(roomId, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} unmuted` });
  });
// routes to send server events through sse
app.get('/events',auth,sendToFollowers);
app.get('/conferences',auth,async(req,res)=>{
  const userId=req.userId;
  try {
  const rooms=await  fetchConferences(userId);
  res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({message:"internal server error"});
  }
 })

app.post("/leave",auth,async(req,res)=>{
  const roomId=req.body.roomId;
  const userId=req.userId;
  const room=await Rooms.findOne({createdBy:userId});
  if(!room){
    return res.status(400).json({msg:"Bad request"});
  };
  try {
    await client.deleteRoom(roomId);
    await Rooms.deleteOne({_id:roomId});
    res.status(200).json({msg:"room destroyed"})
  } catch (error) {
    console.log(error);
    console.log(roomId +"is this")
    res.status(500).json({msg:"internal server error"})
  }

});

// the database connection
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log(process.env.MONGO_URL)
    console.log('database connected');
  }
main();

const port =process.env.PORT ||4000
server.listen(port,()=>{
    console.log('server started')
});