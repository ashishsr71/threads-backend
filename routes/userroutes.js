const {Login, Signup, AddImage}= require('../controllers/user');
const router = require('express').Router();
const jwt= require('jsonwebtoken');
const { auth } = require('../middlewares/auth');

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


router.get('/me',async(req,res)=>{
const refreshToken=req.cookies.refresh_token;

// console.log(refreshToken)
if(!refreshToken){
           res.cookie("access_token",null);
           res.cookie("refresh_token",null)
    return res.status(401).json({msg:"unauthorised"})
};
try {
    const decode=jwt.verify(refreshToken,"jai baba sawath nath");
    const{userId,username}=decode;
    const token=jwt.sign({userId,username},"jai baba sawath nath",{expiresIn:"1d"});
    res.cookie("access_token",token,{httpOnly:false,maxAge:24*60*60*1000,sameSite:"strict"});
    res.status(200).json({token,userId,username});
} catch (error) {
    res.status(401).json({msg:"unauthorized"})
};


});
router.post('/login',Login);
router.post('/signup',Signup);
router.post('/profilepic',auth,AddImage)
module.exports=router;