const {Story,Follow}=require('../modals/modals');

const getStory= async(req,res)=>{
    const userId= req.userId;
    // const whoseUserId= req.params.id;
    try {
      // const user= await Follow.findOne({userId:whoseUserId});
      // if(user.private==true){
      //   if(user.followers.includes(userId)){
      //     const stories=await Story.find({userId:whoseUserId});
      //     return res.status(200).json(stories);
      //   };
      //   return res.status(200).json({msg:"you have to follow"})
  
      // };
  
      const user = await Follow.findOne({userId})
      const userArray=user.following.map(id=>id.toString());
      userArray.push(userId);
      
      const stories = await Story.aggregate([ {
        $lookup: {
          from: 'User', // Replace with your actual user collection name
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
        { $match: { userId: { $in: userArray } } },
        { $group: { _id: '$userId', stories: { $push: '$$ROOT' }, username: { $first: '$user.username' } } }
      ]);
      // console.log(stories)
      
      return res.status(200).json(stories);
  
  
  
    } catch (error) {
      console.log(error)
      res.status(500).json({msg:'internal server error'})
    }
  }
  

module.exports={getStory};

