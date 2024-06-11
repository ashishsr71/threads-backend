require('dotenv').config();

const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors')
const mongoose =require('mongoose')
const {Story,Notification,Post,Comment}= require('./modals/modals')
const bodyParser = require('body-parser')
const {auth}= require('./middlewares/auth');
const router=require('./routes/signup')
const loginrouter= require('./routes/userroutes')
const addStoryRouter= require('./routes/storyroutes')
const postRouter= require('./routes/postroutes');
const followRouter= require('./routes/followroute')

const app  = express();

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


// the signature generator
app.get('/getsignature',auth,async(req,res)=>{

const timestamp= Math.round((new Date).getTime()/1000);
    try {
        const signature= cloudinary.utils.api_sign_request({timestamp},'KxacVQTHO7hlKiDwkKtOtzTBwec');
        res.json({timestamp,signature})
    } catch (error) {
        res.json({error})
    }

});


// upload 
app.post('/upload',auth,async(req,res)=>{
    console.log(req.body)
    const video=req.body;
    try {
        const doc=await Story.create({
            userId:req.userId,
            video:video
            
        });
        res.json(doc)
    } catch (error) {
        res.status(404)
    }


});




// user routes
app.use('/user',addStoryRouter);
app.use('/user',router);
app.use('/user',loginrouter);
app.use('/user',postRouter);
app.use('/user',followRouter);


// create a post route
// create a follower route
// create comment route
// create a like unlike route
// create a follow unfollow route
// create a 







// the database connection
async function main() {
    await mongoose.connect(process.env.MONOG_URL);
    console.log('database connected');
  }
main();

const port =process.env.PORT ||4000
// started server
app.listen(port,()=>{
    console.log('server started')
});