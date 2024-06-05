const router = require('express').Router();
const {addStory}=require('../controllers/story');


router.post('/addstory',addStory);