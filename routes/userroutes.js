const {Login, Signup}= require('../controllers/user');
const router = require('express').Router();


router.post('/login',Login);
router.post('/signup',Signup);

module.exports=router;