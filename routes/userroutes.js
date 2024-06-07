const {Login}= require('../controllers/user');
const router = require('express').Router();


router.post('/login',Login);


module.exports=router;