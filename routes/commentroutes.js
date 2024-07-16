const { commentOnPost, replyComment, getAllComments } = require('../controllers/comment');
const { auth } = require('../middlewares/auth');

const commentRoute= require('express').Router();



commentRoute.post('/newcomment/:id',auth,commentOnPost);
commentRoute.put('/replycomment',auth,replyComment)
commentRoute.get('/getcomments/:id',auth,getAllComments);







module.exports=commentRoute;