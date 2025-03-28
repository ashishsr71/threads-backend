const {Post ,Reply,Follow, Recommend, Repost}= require('../modals/modals');
const { extractHashtags } = require('../utils/findTags');


const createPost = async(req,res)=>{
const userId= req.userId;
const text = req.body?.text;
const media = req.body?.media;

// console.log(media)
try {
    const post = await Post.create({userId,likes:[],media:media,text});
    res.status(200).json(post);
} catch (error) {
    res.status(500).json(error);
}




};


// to get post

const getPosts=async(req,res)=>{
    const userId= req.userId;
   
    try {
        const posts= await Post.find({userId}).populate({path:"userId",select:'username userImg'}) .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get single post
const getsinglePost= async(req,res)=>{
    const postId = req.params.id;
    try {
        const post = await Post.findOne({_id:postId}).populate({path:"userId",select:'username userImg'}) .exec()
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// like a post 
const likePost=async(req,res)=>{
    const userId=req.userId;
    const postId= req.params.id;
    try {
        
        // const post= await Post.findOneAndUpdate({_id:postId},{  $push: { likes: userId  },});
        const post=await Post.findOne({_id:postId});
        if(post.likes.includes(userId)){
            await Post.findOneAndUpdate({_id:postId},{$pull:{likes:userId}});
            const doc= await Post.findOne({_id:postId}).populate({path:"userId",select:'username userImg'}) .exec();
            // console.log("unliked")
            return res.status(200).json({msg:"unliked",doc});
        };
        // console.log('post liked')
        await Post.findOneAndUpdate({_id:postId},{  $push: { likes: userId  },});
     const doc= await Post.findOne({_id:postId}).populate({path:"userId",select:'username userImg'}) .exec();
     const hashtags=extractHashtags(doc.text);
     await Recommend.findOneAndUpdate({userId},{ $addToSet: { tags: { $each: hashtags } } });
        res.status(200).json({msg:'liked',doc});
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
};

const getforFeed= async(req,res)=>{
const userId=req.userId;
try {
    const users= await Follow.findOne({userId});
    const following= users.following;
    const posts= await Post.find({ userId: { $in: following } }).populate({path:"userId",select:'username userImg'}) .exec();
    // console.log(posts)
    res.status(200).json(posts);
} catch (error) {
    res.status(500).json({msg:"internal error"})
}
};


const getForOther=async(req,res)=>{
    const id= req.params.id
    
    try {
      const posts= await Post.find({userId:id}).populate({path:"userId",select:'username userImg'}) .exec();
      res.status(200).json(posts);  
    } catch (error) {
        res.status(500).json(error)
    }
};



const rePost= async(req,res)=>{
    const postId=req.params.id;
    const userId=req.userId;
    try {
        const doesPostExist=await Post.findOne({postId});
        if(!doesPostExist){
            return res.status(400).json({msg:"Bad request"});
        }
        const post=await Repost.create({postId,userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({msg:"Someting went wrong while posting"})
    }
    
};



const deletePost=async(req,res)=>{
const {postId}=req.params.id;
const userId=req.userId;
try {
    const post=await Post.deleteOne({id:postId,userId});
    
    res.status(200).json({msg:"Post deleted succesfully"});
} catch (error) {
    res.status(500).json({msg:"Something went wrong"})
}
};




module.exports={createPost,getPosts,getsinglePost,likePost,unlikePost,reply,getforFeed,getForOther,deletePost,rePost};