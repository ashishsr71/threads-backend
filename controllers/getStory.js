const {Story,Follow}=require('../modals/modals');

const getStory= async(req,res)=>{
    const userId= req.userId;
    const whoseUserId= req.params.id;
    try {
      const user= await Follow.findOne({userId:whoseUserId});
      if(user.private==true){
        if(user.followers.includes(userId)){
          const stories=await Story.find({userId:whoseUserId});
          return res.status(200).json(stories);
        };
        return res.status(200).json({msg:"you have to follow"})
  
      };
  
      const stories = await Follow.find({userId:whoseUserId});
      
      
      return res.status(200).json(stories);
  
  
  
    } catch (error) {
      res.status(500).json({msg:'internal server error'})
    }
  }
  

module.exports={getStory};

