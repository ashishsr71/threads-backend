const followSomeone = require('../controllers/follow');
const { auth } = require('../middlewares/auth');

const router = require('express').Router();


router.post('/follow/:id',auth, followSomeone);





module.exports= router;

