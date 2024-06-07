const {Story}=require('../modals/modals');

const getStory= async(req,res)=>{
const userId= req.userId;
try {
    const doc= await Story.find({userId});
    res.status(200).json(doc);

} catch (error) {
    res.status(500).json(error)
};




};

module.exports={getStory};

