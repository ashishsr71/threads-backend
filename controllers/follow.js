const {auth}= require('../middlewares/auth');
const {Follow,User,Req}= require('../modals/modals');



// this to follow a user
const followSomeone=async(req,res)=>{
    const userId=req.userId;
     const toFollow= req.params.id;
    try {
        // this will send a request  if the account id private
       const target= await User.findOne({userId:toFollow});
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
        const following = await Follow.findOne({toFollow});

        if(doc){
            if(doc.following.includes(toFollow)){
                return res.status(200).json({msg:'already followed'});
            };
           doc.following.push(toFollow);
           following.followers.push(userId);
           await doc.save();
           await following.save();
           return res.status(200).json({id:toFollow});
        };

         await Follow.create({userId,followers:[],following:[toFollow]});
          res.status(200).json({id:toFollow});




    } catch (error) {
        res.status(500).json(error);
    };
};




// get follow followers
const getfollowFollowers= async(req,res)=>{
    const userId=req.userId;
    try {
        const followerAndFollowing= await Follow.findOne({userId});
        // console.log(followerAndFollowing);
        res.status(200).json(followerAndFollowing);
    } catch (error) {
        res.status(500).json({msg:"internal server error"});
    }
}



module.exports= {followSomeone,getfollowFollowers};