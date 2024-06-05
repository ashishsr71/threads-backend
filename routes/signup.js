const {Signup}= require('../controllers/user');
const router = require('express').Router();


router.post('/signup',Signup);





module.exports=router;





