require('dotenv').config();

const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors');
const mongoose =require('mongoose')
const {Updates:Story,Notification,Post,Comment, Rooms}= require('./modals/modals')
const bodyParser = require('body-parser');
const {auth}= require('./middlewares/auth');
const router=require('./routes/signup');
const loginrouter= require('./routes/userroutes');
const addStoryRouter= require('./routes/storyroutes');
const postRouter= require('./routes/postroutes');
const followRouter= require('./routes/followroute')
const {SearchUser} = require('./controllers/user');
const commentRoute = require('./routes/commentroutes');

const messagerouter = require('./routes/messageroutes');
const{io,server,app}=require('./socket/socket');
const { startMessageConsumer } = require('./kafkaconfig/kafka');
const { sendToFollowers, sendEvent } = require('./utils/sseConnection');

// 

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
app.use(bodyParser.json())
app.use(cors());



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
    }

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

// const setUpStream= async()=>{
//     try {
//       const changeStream = Story.watch();
  
//       changeStream.on('change', async (change) => {
//         if (change.operationType === 'delete') {
//           console.log(`Document deleted: ${change.documentKey._id}`);
  
        
//           try {
            
           
//             const deletedAsset = await Story.findById(change.documentKey._id);
//             if (deletedAsset) {
//           await cloudinary.uploader.destroy(deletedAsset.video.public_id);
//             } else {
//               console.log(`Document ${change.documentKey._id} not found.`);
//             }
//           } catch (error) {
//             console.error('Error performing action:', error);
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Error setting up change stream:', error);
//     }
//   };
 
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

  app.get('/getlivetoken',auth, async (req, res) => {
    const metadata=JSON.stringify({role:"host",name:req.username})
   const r= await Rooms.create({roomName:req.body.roomName,participants:[{userId:req.userId,
      name:req.username,
      role:"Host",
      imgUrl:""
    }],createdBy:{name:req.username}});
    await sendEvent(req.userId,r)
    res.send(await createToken(req.username,metadata,r._id));
  });

  app.post('/getlivetoken/new',auth,async(req,res)=>{
    const {roomName,roomId}=req.body;
    const identity=req.username
    const participantMetadata=JSON.stringify({role:"listener",name:req.username})
   
    try {
      const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity,
       metadata:participantMetadata,
        ttl: '10m',
      });
      at.addGrant({ roomJoin: true, room: roomId});
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
async function unmuteParticipant(roomName, identity) {
  try {
    await client.updateParticipant(roomName, identity, undefined, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    // console.log(`Unmuted participant: ${participantIdentity}`);
  } catch (error) {
    console.error("Error unmuting participant:", error);
  }
};


async function muteParticipant(roomName, identity) {
  try {
    await client.updateParticipant(roomName, identity, undefined, {
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });
    // console.log(`Muted participant: ${participantIdentity}`);
  } catch (error) {
    console.error("Error muting participant:", error);
  }
};

  app.post("/mute",auth, async (req, res) => {
    const {isHost}=req.body;
    if(!isHost)return res.status(401).json({msg:"not authorised"});
    const roomName=req.body.roomId;
    const participantIdentity=req?.body?.username;
    await muteParticipant(roomName, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} muted` });
  });
  // route to unmute a participant if you are a host
  app.post("/unmute",auth, async (req, res) => {
      const roomName=req.body.rooId;
      const {isHost}=req.body;
      if(!isHost)return res.status(401).json({msg:"not authorised"});
    const participantIdentity=req?.body?.username;
    await unmuteParticipant(roomName, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} unmuted` });
  });

app.get('/events',auth,sendToFollowers);




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