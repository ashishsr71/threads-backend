const {Post ,Reply}= require('../modals/modals');


const createPost = async(req,res)=>{
const userId= req.userId;
const text = req.body?.text;
try {
    const post = await Post.create({userId,likes:[],media:req.body?.media,text});
    res.status(200).json(post);
} catch (error) {
    res.status(500).json(error);
}




};


// to get post

const getPosts=async(req,res)=>{
    const userId= req.userId;
    try {
        const posts= await Post.find({userId});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get single post
const getsinglePost= async(req,res)=>{
    const postId = req.params.id;
    try {
        const post = await Post.findOne({_id:postId});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// like a post 
const likePost=async(req,res)=>{
    const postId= req.params.id;
    try {
        const post= await Post.findOneAndUpdate({_id:postId},{  $push: { likes: userId  },});
        res.status(200).json({message:'liked'});
    } catch (error) {
        res.status(500).json(error);
    }
};



// unlike a post
const unlikePost= async(req,res)=>{
    const userId= req.userId;
    const postId= req.params.id;
    try {
        const isLiked= await Post.findOne({_id:postId,likes:userId});
        if(isLiked){
            return res.status(200).json({msg:'already liked'})
        }
        await Post.findOneAndUpdate({_id:postId},  { $pull: { likes: userId } });
        res.status(200).json({msg:"post unliked"})
    } catch (error) {
        res.status(500).json(error);
    }
};


const reply= async(req,res)=>{
    const postId=req.params.id;
    const userId = req.userId;
    const body=req.body;
    
    try {
        const doc= await Reply.findOne({postId});
        if(doc){
            doc.replies.push(body);
            const updatedDoc=await doc.save();
            return res.status(200).json(updatedDoc);
        };
     const replidDoc= await Reply.create({postId,userId,replies:[req.body]});
      res.status(200).json(replidDoc);


    } catch (error) {
        res.status(500).json(error)
    }
}








module.exports={createPost,getPosts,getsinglePost,likePost,unlikePost,reply};