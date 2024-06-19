const router = require('express').Router();
const addStory=require('../controllers/story');
const {auth}= require('../middlewares/auth')
const {getStory}=require('../controllers/getStory');


router.post('/addstory',auth,addStory);
router.get('/getStory/:id',auth,getStory);



module.exports= router;