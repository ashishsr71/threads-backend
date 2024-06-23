const {Login, Signup}= require('../controllers/user');
const router = require('express').Router();
const jwt= require('jsonwebtoken');

router.post('/refreshtoken',async(req,res)=>{
    const refreshtoken=req.body.refreshToken;
    if(!refreshtoken){
        return res.status(403).json({msg:'forbideen'});
    };
    const decoded=jwt.verify(refreshtoken,'jai baba sawath nath');
    if(!decoded){
        return res.status(403).json({msg:'forbideen'})
    }
    const userId=decoded.userId;
    const token = jwt.sign({userId:userId},"jai baba sawath nath",{expiresIn:"1d"});
    return res.status(200).json(token);
   
});
router.post('/login',Login);
router.post('/signup',Signup);

module.exports=router;