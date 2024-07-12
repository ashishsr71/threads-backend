const {Story,Follow}=require('../modals/modals')


 const addStory= async(req,res)=>{
  const userId= req.userId;
  const media=req.body;
  const username=req.username;

  try {
    const stories=await Story.find({userId}).select('video');
    console.log(stories)
    // const array= stories.map(story=>)
    const doc= await Story.create({
        userId,
        video:media,
        username,
        user:userId
    });

    res.status(200).json({_id:userId,stories:[doc,...stories]});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:"internal variable"})
  }



};









module.exports= addStory;