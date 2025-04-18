const { createPost, getPosts, getsinglePost, likePost, unlikePost, reply, getforFeed ,getForOther, deletePost, rePost, getRepliedPosts} = require('../controllers/post');
const { auth } = require('../middlewares/auth');


const router= require('express').Router();


router.post('/createpost',auth,createPost);
router.get('/getposts',auth,getPosts);
router.get('/getpost/:id',auth,getsinglePost);
router.put('/likepost/:id',auth,likePost);
router.put('/unlikepost/:id',auth,unlikePost);
router.post('/reply/:id',auth,reply);
router.get("/getfollowposts",auth,getforFeed);
router.get('/getotherposts/:id', auth,getForOther);
router.delete('/deletepost/:postId',auth,deletePost);
router.post('/repost/:postId',auth,rePost);
router.get('/get-replies',auth,getRepliedPosts);

module.exports= router;