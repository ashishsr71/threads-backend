const{User}= require('../modals/modals'); 
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs')


 const Login = async(req,res)=>{
const {email,username,password}= req.body;

if(!email || !username|| !password){
    return res.status(400).json({message:'enter credentails'})
}
try {
     const user= await User.findOne({username});
     const useremail= await User.findOne({email});

     if(user||useremail){
        return res.status(401).json({message:'use another username'});
     };
    

    const hashedPassword= await bcrypt.hash(password,10)
    const doc = await User.create({
        username,email,hashedPassword
    });
   const token= jwt.sign({userId:doc._id},{expiresIn:'1d'});
   res.status(200).json({token});
   

} catch (error) {
    res.status(500).json({message:'internal server error'})
}




 };
 
 module.exports= {Login};