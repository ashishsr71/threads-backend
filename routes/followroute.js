const {followSomeone, getfollowFollowers,getUser} = require('../controllers/follow');
const { auth } = require('../middlewares/auth');

const router = require('express').Router();


router.post('/follow/:id',auth, followSomeone);
router.get('/getfollow',auth,getfollowFollowers);
router.get('/getuser/:id',auth,getUser);



module.exports= router;

