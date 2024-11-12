require('dotenv').config();

const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors');
const mongoose =require('mongoose')
const {Updates:Story,Notification,Post,Comment}= require('./modals/modals')
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

// 

// initalizing socket server

let AccessToken;
let RoomServiceClient;
let client;
(async () => {
  RoomServiceClient=(await import('livekit-server-sdk')).RoomServiceClient;
  AccessToken = (await import('livekit-server-sdk')).AccessToken;
   client=new RoomServiceClient(process.env.LIVEKIT_URL,process.env.LIVEKIT_API_KEY,process.env.LIVEKIT_API_SECRET);
  // Now you can use livekit here or in the rest of your code
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

// async function init(){
//   await startMessageConsumer();
// };
// init();
// the signature generator
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
app.get('/search',SearchUser);










// user routes
app.use('/user',addStoryRouter);
app.use('/user',router);
app.use('/user',loginrouter);
app.use('/user',postRouter);
app.use('/user',followRouter);
app.use('/user',commentRoute)
app.use('/user',messagerouter)

const setUpStream= async()=>{
    try {
      const changeStream = Story.watch();
  
      changeStream.on('change', async (change) => {
        if (change.operationType === 'delete') {
          console.log(`Document deleted: ${change.documentKey._id}`);
  
        
          try {
            
           
            const deletedAsset = await Story.findById(change.documentKey._id);
            if (deletedAsset) {
          await cloudinary.uploader.destroy(deletedAsset.video.public_id);
            } else {
              console.log(`Document ${change.documentKey._id} not found.`);
            }
          } catch (error) {
            console.error('Error performing action:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error setting up change stream:', error);
    }
  };

  const createToken = async (username,participantMetadata) => {
  
    const roomName = 'quickstart-room';
    
    const participantName = username;
  
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: participantName,
      metadata: participantMetadata,
      ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomName,roomAdmin:true });
  
    return await at.toJwt();
  };

  app.get('/getlivetoken',auth, async (req, res) => {
    const metadata=JSON.stringify({role:"host",name:req.username})
    res.send(await createToken(req.username,metadata));
  });

  app.post('/getlivetoken/new',auth,async(req,res)=>{
    const {roomName}=req.body;
    const identity=req.username
    const participantMetadata=JSON.stringify({role:"listener",name:req.username})
    try {
      const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity,
       metadata:participantMetadata,
        ttl: '10m',
      });
      at.addGrant({ roomJoin: true, room: roomName});
    
      const token= await at.toJwt();
      return res.json(token);
    } catch (error) {
      res.status(500).json({msg:"internal server error"})
    }
  });
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
    // const { roomName, participantIdentity } = req.body;
    const roomName="quickstart-room";
    const participantIdentity="amit"
    await muteParticipant(roomName, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} muted` });
  });
  // app.put('/')
  app.post("/unmute", async (req, res) => {
      const roomName="quickstart-room";
    const participantIdentity="amit"
    await unmuteParticipant(roomName, participantIdentity);
    res.send({ success: true, message: `Participant ${participantIdentity} unmuted` });
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