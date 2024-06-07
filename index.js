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



const app  = express();

// global midddlewares
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());


cloudinary.config({
    cloud_name:'dizyncuqs',
    api_key:'171627853614734',
    api_secret:'KxacVQTHO7hlKiDwkKtOtzTBwec',
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


// the database connection
async function main() {
    await mongoose.connect('mongodb+srv://ashishsr71:Daksh2015@cluster0.g0atuug.mongodb.net/threads')
    console.log('database connected');
  }
main();


// started server
app.listen(4000,()=>{
    console.log('server started')
})