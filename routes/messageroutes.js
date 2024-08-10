const { sendMessage } = require('../controllers/messages');
const { auth } = require('../middlewares/auth');

const messagerouter= require('express').Router();



messagerouter.post('/sendmessage',auth,sendMessage);





module.exports=messagerouter;