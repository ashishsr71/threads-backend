const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors')
const mongoose =require('mongoose')
const {Story,Notification,Post,Comment}= require('./modals/modals')
const bodyParser = require('body-parser')

const app  = express();
app.use(express.json());
app.use(bodyParser.json())



cloudinary.config({
    cloud_name:'dizyncuqs',
    api_key:'171627853614734',
    api_secret:'KxacVQTHO7hlKiDwkKtOtzTBwec',
    secure:true
});

app.use(cors());

app.get('/getsignature',async(req,res)=>{

const timestamp= Math.round((new Date).getTime()/1000);
    try {
        const signature= cloudinary.utils.api_sign_request({timestamp,},'KxacVQTHO7hlKiDwkKtOtzTBwec');
        res.json({timestamp,signature})
    } catch (error) {
        res.json({error})
    }

});



app.post('/upload',async(req,res)=>{
    console.log(req.body)
    const{secure_url}=req.body;
    try {
        const doc=await Post.create({
            userId:1321321,
            video:{secure_url}
            
        });
        res.json(doc)
    } catch (error) {
        res.status(404)
    }


})

async function main() {
    await mongoose.connect('mongodb+srv://ashishsr71:Daksh2015@cluster0.g0atuug.mongodb.net/threads')
    console.log('database connected');
  }
main();
app.listen(4000,()=>{
    console.log('server started')
})