// const {auth}= require('../middlewares/auth');
const {Follow,User,Req}= require('../modals/modals');



// this to follow a user
const followSomeone=async(req,res)=>{
    const userId=req.userId;
     const toFollow= req.params.id;
    try {
        // this will send a request  if the account id private
       const target= await User.findOne({_id:toFollow});
            const isPrivate= target.private;
            if(isPrivate){
                const reqDoc= await Req.findOne({userId:toFollow});
                if(reqDoc){
                    reqDoc.requests.push(userId);
                    await reqDoc.save();
                    return res.status(200).json({message:'request sent'});
                };
              await Req.create({userId:toFollow,requests:[userId]});
              return res.status(201).json({message:'request sent w'});
            };

            // this will follow the user if account is public
        const doc= await Follow.findOne({userId});
        const otherUser= await Follow.findOne({userId:toFollow});
        // console.log(otherUser)

        if(doc){
            if(doc.following.includes(toFollow)){
                return res.status(200).json({msg:'already followed'});
            };
           doc.following.push(toFollow);
           otherUser.followers.push(userId);
           await doc.save();
           await otherUser.save();
           return res.status(200).json({id:toFollow});
        };

         await Follow.create({userId,followers:[],following:[toFollow]});
          res.status(200).json({id:toFollow});




    } catch (error) {
        // console.log(error);
        res.status(500).json(error);
    };
};




// get follow followers
const getfollowFollowers= async(req,res)=>{
    const userId=req.userId;
    try {
        const followerAndFollowing= await Follow.findOne({userId});
        const userdata= await User.findOne({_id:userId}).select('username');
        // console.log(followerAndFollowing);
        res.status(200).json({...followerAndFollowing._doc,username:userdata.username});
    } catch (error) {
        res.status(500).json({msg:"internal server error"});
    }
};



const getUser=async(req,res)=>{
    
    const id=req.params.id;
    // console.log(id)
    try {
       const user=await User.findOne({_id:id}).select('username userImg');
       const followers=await Follow.findOne({userId:id});
    //    console.log(followers._doc)
       res.status(200).json({username:user.username,...followers._doc,userImg:user.userImg})
    } catch (error) {
        // console.log(error)
        res.status(500).json({msg:'internal server error'});
    }
}



module.exports= {followSomeone,getfollowFollowers,getUser};