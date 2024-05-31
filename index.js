const express = require('express');
const cloudinary= require('cloudinary').v2;
const cors=require('cors')

const app  = express();
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
// all 
})

app.listen(4000,()=>{
    console.log('server started')
})