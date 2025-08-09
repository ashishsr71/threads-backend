const jwt = require('jsonwebtoken');




  const auth= async(req,res,next)=>{
   
const token =req.headers.token;
// console.log(token)
if(!token){
    return res.status(401).json({message:'unauthorized1'});
}
try {
    const decoded=jwt.verify(token,'jai baba sawath nath');
    req.userId=decoded.userId;
    req.username=decoded.username;
    next();
} catch (error) {
     return res.status(401).json({message:'unauthorized'})
}
}


module.exports={auth};