const{User}= require('../modals/modals'); 
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs')


 const Signup = async(req,res)=>{
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
    console.log(hashedPassword)
    const doc = await User.create({
        username,email,password:hashedPassword
    });
   const token= await jwt.sign({userId:doc._id},"jai baba sawath nath",{expiresIn:'1d'});
   res.status(200).json({token});
   

} catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
}




 };

//  the login function
const Login=async(req,res)=>{
    const {username,email,password}= req.body;
    try {
        if(!username || !password){
            return res.status(401).json({message:'invalid credential'})
        };
        
        const user = await User.findOne({username});
        // console.log(user)
        if(!user){
            return res.status(401).json({message:'invalid'});
        };
        
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(401).json({message:'invalidc'})
        };
        const token = jwt.sign({userId:user._id},"jai baba sawath nath",{expiresIn:"1d"});
        res.status(200).json({token});
        
    } catch (error) {
        res.status(500).json(error)
    }




 
};






 
 module.exports= {Signup,Login};