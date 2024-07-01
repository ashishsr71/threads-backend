const {followSomeone, getfollowFollowers} = require('../controllers/follow');
const { auth } = require('../middlewares/auth');

const router = require('express').Router();


router.post('/follow/:id',auth, followSomeone);
router.get('/getfollow',auth,getfollowFollowers);




module.exports= router;

