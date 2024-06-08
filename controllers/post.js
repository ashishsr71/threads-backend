const {Post }= require('../modals/modals');


const createPost = async(req,res)=>{
const userId= req.userId;
try {
    const post = await Post.create({userId,likes:[],video:req.body});
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
    const postId = req.query.id;
    try {
        const post = await Post.findOne({_id:postId});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// like a post 
const likePost=async(req,res)=>{
    const postId= req.query.id;
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
    const postId= req.query.id;
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
    const userId = req.userId;
    
}








module.exports={createPost,getPosts,getsinglePost,likePost,unlikePost};