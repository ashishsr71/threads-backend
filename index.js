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
(async () => {
  AccessToken = (await import('livekit-server-sdk')).AccessToken;
  
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
// upload 
// app.post('/upload/story',auth,async(req,res)=>{
//     console.log(req.body)
//     const video=req.body;
//     try {
//         const doc=await Story.create({
//             userId:req.userId,
//             video:video
            
//         });
//         res.json(doc)
//     } catch (error) {
//         res.status(500).json(error);
//     }


// });









// user routes
app.use('/user',addStoryRouter);
app.use('/user',router);
app.use('/user',loginrouter);
app.use('/user',postRouter);
app.use('/user',followRouter);
app.use('/user',commentRoute)
app.use('/user',messagerouter)
// create a post route  
// create a follower route
// create comment route
// create a like unlike route
// create a follow unfollow route
// create a 
const setUpStream= async()=>{
    try {
      const changeStream = Story.watch();
  
      changeStream.on('change', async (change) => {
        if (change.operationType === 'delete') {
          console.log(`Document deleted: ${change.documentKey._id}`);
  
          // Perform your backend action here
          try {
            
            // Example: Fetch additional data or perform necessary actions
            const deletedAsset = await Story.findById(change.documentKey._id);
            if (deletedAsset) {
            //   console.log(`Performing action for deleted document: ${deletedAsset._id}`);
              // Perform actions here, such as logging or triggering notifications
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

  const createToken = async (username) => {
    // If this room doesn't exist, it'll be automatically created when the first
    // client joins
    const roomName = 'quickstart-room';
    // Identifier to be used for participant.
    // It's available as LocalParticipant.identity with livekit-client SDK
    const participantName = username;
  
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: participantName,
      // Token to expire after 10 minutes
      ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomName });
  
    return await at.toJwt();
  }
  app.get('/getlivetoken',auth, async (req, res) => {
    res.send(await createToken(req.username));
  });

  app.post('/getlivetoken/new',auth,async(req,res)=>{
    const {roomName}=req.body;
    const identity=req.username
    try {
      const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity,
        // Token to expire after 10 minutes
        ttl: '10m',
      });
      at.addGrant({ roomJoin: true, room: roomName });
    
      const token= await at.toJwt();
      return res.json(token);
    } catch (error) {
      res.status(500).json({msg:"internal server error"})
    }
  });



// the database connection
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    // await setUpStream();
    console.log(process.env.MONGO_URL)
    console.log('database connected');
  }
main();

const port =process.env.PORT ||4000
// started server
server.listen(port,()=>{
    console.log('server started')
});