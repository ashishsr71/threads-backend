const {Login, Signup, AddImage, logout, forgotPassword}= require('../controllers/user');
const router = require('express').Router();
const jwt= require('jsonwebtoken');
const { auth } = require('../middlewares/auth');


router.post('/refreshtoken',async(req,res)=>{
    const refreshtoken=req.body.refreshToken;
    // console.log(refreshtoken)
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
console.log(refreshToken)

if(!refreshToken){
    // console.log(refreshToken)
           res.cookie("access_token",null);
           res.cookie("refresh_token",null)
    return res.status(401).json({msg:"unauthorised",refreshToken})
};
try {
    const decode=jwt.verify(refreshToken,"jai baba sawath nath");
    const{userId,username}=decode;
   const token = jwt.sign({userId,username:username},"jai baba sawath nath",{expiresIn:"1d"});
   const refresh_Token=jwt.sign({userId,username:username},"jai baba sawath nath",{expiresIn:"5d"});
    //  res.cookie('access_token',token,{httpOnly:true,maxAge:24*60*60*1000,sameSite:"None",secure:true});
    //  res.cookie('refresh_token',refresh_Token,{httpOnly:true,maxAge:5*24*60*60*1000,sameSite:"None",secure:true});
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
        path: '/'
      });
      res.cookie('refresh_token', refresh_Token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
        path: '/'
      });
    res.status(200).json({token,userId,username});
} catch (error) {
    // console.log(error)
    res.status(401).json({msg:"unauthorized",})
};


});
router.post('/login',Login);
router.post('/signup',Signup);
router.post('/profilepic',auth,AddImage)
router.post('/logout',logout);
router.post('/forgot-password',forgotPassword);
module.exports=router;