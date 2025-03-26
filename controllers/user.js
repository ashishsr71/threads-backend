const{User, Follow}= require('../modals/modals'); 
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
        return res.status(400).json({message:'use another username'});
     };
    

    const hashedPassword= await bcrypt.hash(password,10)
    
    const doc = await User.create({
        username,email,password:hashedPassword
    });
    await Follow.create({followers:[],following:[],userId:doc._id,private:false,username:username});
   const token=  jwt.sign({userId:doc._id,username:doc.username},"jai baba sawath nath",{expiresIn:'1d'});
   res.cookie('access_token',token,{httpOnly:true,maxAge:24*60*60*1000,sameSite:"None",secure:true});
   res.status(200).json({token,userId:doc._id,username:doc.username});
   

} catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
}




 };

//  the login function
const Login=async(req,res)=>{
    const {email,password}= req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:'invalid credential'})
        };
        
        const user = await User.findOne({email});
        // console.log(user)
        if(!user){
            return res.status(400).json({message:'invalid'});
        };
        
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({message:'invalid'})
        };
        const token = jwt.sign({userId:user._id,username:user.username},"jai baba sawath nath",{expiresIn:"1d"});
        const refreshToken=jwt.sign({userId:user._id,username:user.username},"jai baba sawath nath",{expiresIn:"5d"});
        res.cookie('access_token',token,{httpOnly:true,maxAge:24*60*60*1000,sameSite:"None",secure:true});
        res.cookie('refresh_token',refreshToken,{httpOnly:true,maxAge:5*24*60*60*1000,sameSite:"None",secure:true});
        res.status(200).json({token,userId:user._id,refreshToken,username:user.username});
        
    } catch (error) {
        res.status(500).json(error)
    }




 
};

const AddImage=async(req,res)=>{
const userId=req.userId;
const newImgUrl=req.body.url;
// console.log(newImgUrl)
try {
    const user=await User.findOneAndUpdate({_id:userId},{userImg:newImgUrl});
    if(user.userImg?.length>0||!user.userImg){};
    const fromFollow=await Follow.findOneAndUpdate({userId},{userImage:newImgUrl});
    
    
    res.status(200).json({msg:"profile picture updated",url:newImgUrl})
} catch (error) {
    console.log(error)
    res.status(500).json({msg:"internal server error"})
}
};



const SearchUser= async(req,res)=>{
const toSearch= req.query.username;
const regex = new RegExp(`^${toSearch}`, 'i')
const users= await User.find({username: regex}).select('username').limit(10)
res.status(200).json(users)
};

// const getMyself= async(req,res)=>{
//     const userId=req.userId;
//     try {
//         const user=await User.findOne({_id:userId}).select('username');
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({message:error});
//     }
// };

const logout = async (req, res) => {
    // const refreshToken=req.cookies.refresh_token;
    // console.log(refreshToken);
    //   res.clearCookie("access_token");
	// 	res.clearCookie("refresh_token");
           res.cookie("access_token",null);
           res.cookie("refresh_token",null);
    res.json({ msg: "Logged out successfully" });
};



 
 module.exports= {Signup,Login,SearchUser,AddImage,logout};