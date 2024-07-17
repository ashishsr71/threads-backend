const {Comment}= require('../modals/modals');





const commentOnPost=async(req,res)=>{
const userId= req.userId;
const postId=req.params.id;
const username=req.username;
const text=req.body.text;
try {
    const comment= await Comment.create({
       replie:text, postId,by:{username,userId},likes:[],to:[]
    });
    res.status(200).json(comment);
} catch (error) {
    res.status(500).json({msg:'internal server error'});
}

};


const replyComment= async(req,res)=>{
    const userId=req.userId;
    const username=req.username;
    const text= req.body.text;
    const id=req.params.id;
    const to=req.body.to;
    try {
        // const comment= await Comment.findOneAndUpdate({_id:id},{replies:{$push:{to,replie:text,likes:[],by:{username}}}});
        const comment={to:[{to}],likes:[],replie:text,by:{username,userId},};
        const newcomment=await Comment.findOneAndUpdate({_id:id},{replies:{$push:comment}});
        res.status(200).json(newcomment);
    } catch (error) {
        res.status(500).json({msg:"interval server error"})
    }
};



const getAllComments= async(req,res)=>{
    const postId=req.params.id;
    try {
        const comments= await Comment.find({postId});
        res.status(200).json(comments);
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal server error"})
    }
}



module.exports={commentOnPost,replyComment,getAllComments};