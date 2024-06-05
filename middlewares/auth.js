const jwt = require('jsonwebtoken');




  const auth= async(req,res,next)=>{
const token =req.headers.token;
if(!token){
    return res.status(401).json({message:'unauthorized'});
}
try {
    const decoded=jwt.verify(token,'jai baba sawath nath');
    req.userId=decoded.userId;
    next();
} catch (error) {
     return res.status(400).json({message:'unauthorized'})
}
}


module.exports={auth};