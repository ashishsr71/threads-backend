const {Story,Follow}=require('../modals/modals')


 const addStory= async(req,res)=>{
  const userId= req.userId;
  const media=req.body;

  try {
    const doc= await Story.create({
        userId,
        video:media
    });

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({msg:"internal variable"})
  }



};






module.exports= addStory;